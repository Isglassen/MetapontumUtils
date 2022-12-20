/**
 * Convert a number of milliseconds to a hh:mm:ss format
 * rounds the seconds using the secondsFunction
 * @param {number} milliseconds 
 * @param {Function} secondsFunction 
 * @param {boolean} showSeconds
 * @returns 
 */
function toTimeString(milliseconds, secondsFunction = Math.floor, showSeconds = true) {
    const seconds = secondsFunction(milliseconds/1000)
    const h = Math.floor(seconds/(60*60))
    const m = Math.floor((seconds-(h*60*60))/(60))
    const s = (seconds-(h*60*60)-(m*60))
    
    // Adds a leading zero to numbers of 1 length
    function stringMinLen2(num) { return num.toString().length == 1? "0"+num: num.toString() }

    return `${stringMinLen2(h)}:${stringMinLen2(m)}${showSeconds? (":"+stringMinLen2(s)): ""}`
}

class ScheduleEntry {
    constructor(groups, name, weekday, startHour, startMinute, endHour, endMinute, style) {
        this.groups = Array.isArray(groups)? groups: [groups]
        this.name = name
        this.weekday = weekday
        this.startMilliseconds = startHour*60*60*1000 + startMinute*60*1000
        this.endMilliseconds = endHour*60*60*1000 + endMinute*60*1000
        this.styleData = style // The colors that should be used for the lesson, as html style tag data
    }

    // Checks if a studentss group list is in this lessons list
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
        // If it's not the same day
        if (date.getDay()-1 != this.weekday) return false;
        const dateMilliseconds = getInMilliseconds(date)

        // Or if it's before the start or after the end, return false
        // TODO: Assumes it's the same week... 
        if (dateMilliseconds < this.startMilliseconds || dateMilliseconds > this.endMilliseconds) return false;

        return true;
    }

    // Get the string for this lesson
    getString(date, includeAfter, excludeGroups) {
        if (this.isCurrent(date)) {
            // Current lesson string
            return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> slutar om <b>${toTimeString(this.endMilliseconds - getInMilliseconds(date), Math.ceil, true)}</b><br></span>`
        }
        if (getInMilliseconds(date) < this.startMilliseconds) {
            // Future lesson string
            return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> börjar om <b>${toTimeString(this.startMilliseconds - getInMilliseconds(date), Math.ceil, true)}</b><br></span>`
        }
        if (getInMilliseconds(date) > this.endMilliseconds && includeAfter) {
            // Past lesson string (if we include lessons after they end)
            return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> slutate <b>${toTimeString(getInMilliseconds(date) - this.endMilliseconds, Math.floor, true)}</b> sedan<br></span>`
        }
        // We don't include the lesson
        return ""
    }

    // Get a string for when the lesson is, instead of in how long
    getTimeString(excludeGroups) {
        return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> kl. <b>${toTimeString(this.startMilliseconds, Math.floor, false)}</b><br></span>`
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

function getLessonDate(week, weekday) {
    let date = week == "thisWeek"? new Date(seperators.lastWeek): new Date(seperators.thisWeek)
    date.setDate(date.getDate() + weekday-1)
    return date
}

// Get epoch since the start of the dates current day
function getInMilliseconds(date) {
    return date.getHours()*60*60*1000 + date.getMinutes()*60*1000 + date.getSeconds()*1000 + date.getMilliseconds()
}

function getThisWeek(date) {
    // TODO: Add a case for if it's past the next week
    // If the date's time is past the weekSeperator, return the next week
    if (date.getTime() - seperators.thisWeek.getTime()>0) return schedule.nextWeek;
    // Otherwise return the current week
    return schedule.thisWeek
}

function getNextDayWeek(date) {
    // Initialise variables for the start of counting
    let week = ""
    let weekday = 0

    // If it's before this week, the next day is monday this week
    if (seperators.lastWeek.getTime() - date.getTime()>0) {
        week = "thisWeek"
        weekday = 1
    }
    // If it's the next week
    else if (seperators.thisWeek.getTime() - date.getTime()<0) {
        // TODO: Add a case for if it's past the next week
        // If it's a sunday, we have no next day
        if (date.getDay() == 0) {
            console.log("No day")
            return ["",0,[]]
        }
        // Otherwise simply start at the next day
        week = "nextWeek"
        weekday = date.getDay() + 1
    }
    // If it's the current week, but a sunday, set the next week
    else if (date.getDay() == 0) {
        week = "nextWeek"
        weekday = 1
    }
    // Otherwise simply use next day
    else {
        week = "thisWeek"
        weekday = date.getDay() + 1
    }

    // Loop through every day from the previously set day until we find one with lessons
    while (schedule[week][weekday-1].length === 0) {
        // Increase the week if it's a sunday
        if (weekday == 0) {
            // There is no next day
            if (week === "nextWeek") return ["",0,[]]
            week = "nextWeek" // Increase week
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
  