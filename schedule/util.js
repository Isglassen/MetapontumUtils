// Adds this leading zero to numbers of 1 length
function stringMinLen2(num) { return num.toString().length == 1? "0"+num: num.toString() }

/**
 * Convert this number of milliseconds to this hh:mm:ss format
 * rounds the seconds using the secondsFunction
 * @param {number} milliseconds 
 * @param {Function} secondsFunction 
 * @param {boolean} showSeconds
 * @returns 
 */
function toTimeString(milliseconds, secondsFunction = Math.floor, showSeconds = true) {
    const seconds = secondsFunction(milliseconds/1000)
    const d = Math.floor(seconds/(24*60*60))
    const h = Math.floor((seconds/(60*60))-(d*24))
    const m = Math.floor((seconds/60)-(d*24*60)-(h*60))
    const s = seconds-(d*24*60*60)-(h*60*60)-(m*60)

    return `${d!==0?stringMinLen2(d)+":":""}${stringMinLen2(h)}:${stringMinLen2(m)}${showSeconds? (":"+stringMinLen2(s)): ""}`
}

/** 
 * Can be used when combining schedules to sort them (since we assume it is)
 * @param {ScheduleEntry} a 
 * @param {ScheduleEntry} b 
 * @returns {number}
 */
function scheduleSortFn(a, b) {
    if (a.startMilliseconds < b.startMilliseconds) return -1
    if (a.startMilliseconds > b.startMilliseconds) return 1
    
    if (a.endMilliseconds < b.endMilliseconds) return -1
    if (a.endMilliseconds > b.endMilliseconds) return 1
    
    return 0
}

function lessonInSchedule(schedule, lesson) {
    for (let i=0; i<schedule.length; i++) {
        if (schedule[i].equals(lesson)) return true
    }
}

/**
 * Returns a new schedule including both schedules
 * @param {ScheduleEntry[]} a 
 * @param {ScheduleEntry[]} b 
 */
function mergeSchedules(a, b) {
    let outSchedule = []
    for (let i=0; i<a.length; i++) {
        outSchedule.push(a[i])
    }
    for (let i=0; i<b.length; i++) {
        if (!lessonInSchedule(outSchedule, b[i])) outSchedule.push(b[i])
    }
    outSchedule.sort(scheduleSortFn)
    return outSchedule
}

class ScheduleEntry {
    /**
     * @param {any} other
     * @returns {boolean}
     */
    equals(other) {
        if (!(other instanceof ScheduleEntry)) return false
        if (this.startMilliseconds !== other.startMilliseconds) return false
        if (this.endMilliseconds !== other.endMilliseconds) return false
        if (this.name !== other.name) return false
        if (this.week !== other.week) return false
        if (this.weekday !== other.weekday) return false
        if (this.groups.length !== other.groups.length) return false
        for (let i=0; i<this.groups.length; i++) {
            if (!other.groups.includes(this.groups[i])) return false
        }
        return true
    }
    
    constructor(groups, name, weekday, startHour, startMinute, endHour, endMinute, style, week, seperators) {
        this.groups = Array.isArray(groups)? groups: [groups]
        this.name = name
        this.weekday = weekday
        this.week = week
        let startDate = getLessonDate(seperators, week, weekday+1)
        let endDate = getLessonDate(seperators, week, weekday+1)
        startDate.setHours(startHour)
        startDate.setMinutes(startMinute)
        endDate.setHours(endHour)
        endDate.setMinutes(endMinute)
        this.startMilliseconds = startDate.getTime()
        this.endMilliseconds = endDate.getTime()
        this.styleData = style // The colors that should be used for the lesson, as html style tag data
    }

    // Checks if this students group list is in this lessons list
    studentHas(groups) {
        // If there is no group list then everyone matches
        if (this.groups.length == 0) return true

        // Simple loop of check every item in groups for each this.groups
        // return true if anything matches
        for (let i=0; i<this.groups.length; i++) {
            if (groups.includes(this.groups[i])) return true
        }

        return false
    }

    // Get the lessons title
    // TODO: Exclude field to maybe not include the obvious 9A/9B for every lesson
    getTitle(excludeGroups) {

        let showGroups = []
        for (let i=0; i<this.groups.length; i++) { 
            if (Array.isArray(excludeGroups) && excludeGroups.includes(this.groups[i])) continue
            showGroups.push(this.groups[i])
        }

        if (showGroups.length == 0) return this.name
        return `[${showGroups.join(",")}]: ${this.name}`
    }

    /**
     * Check if this is the current lesson
     * @param {Date} date 
     */
    isCurrent(date) {
        const dateMilliseconds = date.getTime()

        // Or if it's before the start or after the end, return false
        if (dateMilliseconds < this.startMilliseconds || dateMilliseconds > this.endMilliseconds) return false;

        return true;
    }

    // Get the string for this lesson
    getString(date, includeAfter, excludeGroups) {
        if (this.isCurrent(date)) {
            // Current lesson string
            return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> slutar om <b>${toTimeString(this.endMilliseconds - date.getTime(), Math.ceil, true)}</b><br></span>`
        }
        if (date.getTime() < this.startMilliseconds) {
            // Future lesson string
            return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> börjar om <b>${toTimeString(this.startMilliseconds - date.getTime(), Math.ceil, true)}</b><br></span>`
        }
        if (date.getTime() > this.endMilliseconds && includeAfter) {
            // Past lesson string (if we include lessons after they end)
            return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> slutate <b>${toTimeString(date.getTime() - this.endMilliseconds, Math.floor, true)}</b> sedan<br></span>`
        }
        // We don't include the lesson
        return ""
    }

    // Get a string for when the lesson is, instead of in how long
    getTimeString(excludeGroups) {
        let tempDate = new Date()
        tempDate.setTime(this.startMilliseconds)
        return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> kl. <b>${toTimeString(getInMilliseconds(tempDate), Math.floor, false)}</b><br></span>`
    }
}

function addGroup(groupList, group) {
    if (!groupList.includes(group)) {
        groupList.push(group)
    }
}

function removeGroup(groupList, group) {
    if (groupList.includes(group)) {
        groupList.splice(groupList.indexOf(group), 1)
    }
}

function getLessonDate(seperators, week, weekday) {
    let date = new Date(seperators[week])
    date.setDate(date.getDate() + weekday-1)
    return date
}

// Get epoch since the start of the dates current day
function getInMilliseconds(date) {
    return date.getHours()*60*60*1000 + date.getMinutes()*60*1000 + date.getSeconds()*1000 + date.getMilliseconds()
}

function getThisWeekNum(seperators, date){
    let week = 0
    while (date.getTime() - seperators[week].getTime()>0) {
        week++
        if (week>=seperators.length) {
            let endSeperator = new Date(seperators[week-1])
            endSeperator.setDate(endSeperator.getDate()+7)
            if (date.getTime() - endSeperator.getTime()>0) return null
            break
        }
    }
    return week-1
}

function getThisWeek(schedule, seperators, date) {
    let week = getThisWeekNum(seperators, date)
    if (week ===null || week < 0) return null
    return schedule[week]
}

function getNextDayWeek(schedule, seperators, date) {
    // Initialise variables for the start of counting
    let week = getThisWeekNum(seperators, date)
    let weekday = 0

    if (week === null) return ["",0,[]]

    // If it's before this week, the next day is monday this week
    if (week<0) {
        week = 0
        weekday = 1
    }
    else {
        // If it's a sunday, set the next week
        if (date.getDay()==0) {
            week++
            weekday = 1
        }
        else {
            weekday = date.getDay() + 1
        }
    }

    // Loop through every day from the previously set day until we find one with lessons
    while (schedule[week][weekday===0? 6: weekday-1].length === 0) {
        // Increase the week if it's a sunday
        if (weekday == 0) {
            week++
            // There is no next day
            if (week>=schedule.length) return ["",0,[]]
        }

        weekday++
        // Sunday is 0
        if (weekday>6) weekday = 0
    }

    // Return week, weekday, schedule
    return [week, weekday, schedule[week][weekday-1]]
}

// Credit: https://chat.openai.com/chat
function createCookie(name, value, days) {
    // Encode the value to make sure it doesn't contain any special characters
    const encodedValue = encodeURIComponent(value);
    let expires = ""

    // Create a date object that will be used to set the expiration date of the cookie
    if (days !== null) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    // Set the cookie string, which contains the name-value pair and any options for the cookie
    const cookieString = name + "=" + encodedValue + expires + "; path=/";

    // Use the 'document.cookie' property to set the cookie
    document.cookie = cookieString;
}

function getCookie(name) {
    // Use the 'decodeURIComponent' function to decode the value of the cookie
    const decodedCookie = decodeURIComponent(document.cookie);

    // Create an array of all the name-value pairs in the cookie
    const pairs = decodedCookie.split(";");

    // Loop through the name-value pairs and return the value for the specified cookie name
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        if (pair[0].trim() == name) {
            return pair[1];
        }
    }
    return null;
}
  