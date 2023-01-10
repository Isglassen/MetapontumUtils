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

/**
 * @param {ScheduleEntry[]} schedule 
 * @param {ScheduleEntry} lesson 
 * @returns {boolean}
 */
function lessonInDaySchedule(schedule, lesson) {
    for (let lessonIndex=0; lessonIndex<schedule.length; lessonIndex++) {
        if (schedule[lessonIndex].equals(lesson)) return true
    }
    return false
}

class Setting {
    /**
     * @param {any} value 
     * @param {SaveType} cookie 
     * @param {SaveType} queryParam 
     */
    constructor(value, cookie, queryParam) {
        this.value = value
        this.cookie = cookie
        this.queryParam = queryParam
    }
    get() {
        return this.value
    }
    set(value) {
        this.value = value
        return true
    }
    modify(transformFunction) {
        this.value = transformFunction(this.value)
    }
    getURIComponent() {
        return encodeURIComponent(this.queryParam.name) + "=" +
        encodeURIComponent(this.queryParam.encode(this.value))
    }
}

class SaveType {
    /**
     * @param {string} name 
     * @param {Function} encoder 
     * @param {Function} decoder 
     */
    constructor(name, encoder, decoder) {
        this.name = name,
        this.encode = encoder
        this.decode = decoder
    }
    copy(name=this.name) {
        return new SaveType(name, this.encode, this.decode)
    }
}

class Settings {
    constructor() {
        // Default encoders/decoders
        this.stringType = new SaveType("", val=>val, val=>val)
        this.intType = new SaveType("", val=>val, val=>parseInt(val))
        this.floatType = new SaveType("", val=>val, val=>parseFloat(val))
        this.boolType = new SaveType("", val=>+val, val=>val==="1")
        this.jsonType = new SaveType("", val=>JSON.stringify(val), val=>JSON.parse(val))

        this.queryParams = new Proxy(new URLSearchParams(window.location.search), {
            //@ts-ignore
            get: (searchParams, prop) => searchParams.get(prop),
        });
        /** @type {Object.<string, Setting>} */
        this.values = {}
    }
    set(name, value) {
        return this.values[name]?.set(value)
    }
    get(name) {
        return this.values[name]?.get()
    }
    /**
     * @param {string} name 
     * @param {SaveType} cookie 
     * @param {SaveType} queryParam 
     * @param {any} defaultValue 
     */
    addSetting(name, cookie, queryParam, defaultValue) {
        let value = defaultValue
        if (getCookie(cookie.name) !== null) value = cookie.decode(getCookie(cookie.name))
        if (this.queryParams[queryParam.name] !== null) value = queryParam.decode(this.queryParams[queryParam.name])

        this.values[name] = new Setting(value, cookie, queryParam)
    }
    saveCookies() {
        for (let setting in this.values) {
            let settingItem = this.values[setting]
            createCookie(settingItem.cookie.name, settingItem.cookie.encode(settingItem.value), null)
        }
    }
    removeCookies() {
        for (let setting in this.values) {
            createCookie(this.values[setting].cookie.name, null, -1)
        }
    }
    generateLink() {
        let settingStrings = []
        for (let setting in this.values) {
            settingStrings.push(
                this.values[setting].getURIComponent()
            )
        }
        return window.location.origin + window.location.pathname + '?' + settingStrings.join("&")
    }
    modify(name, transformFunction) {
        this.values[name].modify(transformFunction)
    }
}

/**
 * Convert a group list into groups seperated by seperator
 * @param {string[]} groups 
 * @param {string} seperator 
 * @returns {string?} returns null when a group name includes the seperator
 */
function encodeGroups(groups, seperator) {
    for (let i=0; i<groups.length; i++) {
        if (groups[i].includes(seperator)) return null
    }
    let groupString = groups.join(seperator)
    return groupString
}

/**
 * Convert group names seperated by seperator into a list of groups
 * @param {string} groupString 
 * @param {string} seperator 
 * @returns {string[]}
 */
function decodeGroups(groupString, seperator) {
    let groups = groupString.split(seperator)
    return groups
}

/**
 * Returns a new day schedule including both day schedules
 * @param {ScheduleEntry[]} a 
 * @param {ScheduleEntry[]} b 
 */
function mergeDaySchedules(a, b) {
    let outSchedule = []
    for (let lesson=0; lesson<a.length; lesson++) {
        outSchedule.push(a[lesson])
    }
    for (let lesson=0; lesson<b.length; lesson++) {
        let inSchedule = lessonInDaySchedule(outSchedule, b[lesson])
        console.log("("+b[lesson].getStartTimeString()+"-"+b[lesson].getEndTimeString()+") "
            +b[lesson].getTitle([])+" in a: "+inSchedule)
        if (!inSchedule) outSchedule.push(b[lesson])
    }
    outSchedule.sort(scheduleSortFn)
    return outSchedule
}

/**
 * Updates every start/endMilliseconds
 * @param {ScheduleEntry[][][]} schedule
 * @param {Date[]} seperators 
 */
function reloadSchedule(schedule, seperators) {
    console.group("Schedule Reload")
    for (let week=0; week<schedule.length; week++) {
        console.groupCollapsed("Week "+week)
        for (let day=0; day<schedule[week].length; day++) {
            console.groupCollapsed("Day "+day)
            for (let lesson=0; lesson<schedule[week][day].length; lesson++) {
                let entry = schedule[week][day][lesson]

                console.groupCollapsed(
                    entry.name+" for "+entry.groups.join(", ")+" from "+
                    stringMinLen2(entry.inputTimes.startHour)+":"+stringMinLen2(entry.inputTimes.startMinute)+" to "+
                    stringMinLen2(entry.inputTimes.endHour)+":"+stringMinLen2(entry.inputTimes.endMinute)
                )

                if (entry.week !== week) console.warn("Week info did not match lessons actual week");
                if (entry.weekday !== day) console.warn("Weekday did not match lessons actual day");

                entry.week = week
                entry.weekday = day

                let startDate = getLessonDate(seperators, week, entry.weekday+1)
                let endDate = getLessonDate(seperators, week, entry.weekday+1)
                startDate.setHours(entry.inputTimes.startHour)
                startDate.setMinutes(entry.inputTimes.startMinute)
                endDate.setHours(entry.inputTimes.endHour)
                endDate.setMinutes(entry.inputTimes.endMinute)
                entry.startMilliseconds = startDate.getTime()
                entry.endMilliseconds = endDate.getTime()

                console.groupEnd()
            }
            console.groupEnd()
        }
        console.groupEnd()
    }
    console.groupEnd()
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
        for (let group=0; group<this.groups.length; group++) {
            if (!other.groups.includes(this.groups[group])) return false
        }
        return true
    }
    
    /**
     * @param {string[]|string} groups 
     * @param {string} name 
     * @param {number} weekday (0-6 where 0 is Monday)
     * @param {number} startHour (0-23)
     * @param {number} startMinute (0-59)
     * @param {number} endHour (0-23)
     * @param {number} endMinute (0-59)
     * @param {string} style CSS Style 
     * @param {number} week Week index 
     * @param {Date[]} seperators Indicates the start of each week 
     */
    constructor(groups, name, weekday, startHour, startMinute, endHour, endMinute, style, week, seperators) {
        this.groups = Array.isArray(groups)? groups: [groups]
        this.name = name
        this.weekday = weekday
        this.week = week
        this.inputTimes = {startHour: startHour, startMinute: startMinute, endHour: endHour, endMinute: endMinute}
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

    /**
     * Checks if this students group list is in this lessons list
     * @param {string[]} groups The groups of the student
     * @returns {boolean}
     */
    studentHas(groups) {
        // If there is no group list then everyone matches
        if (this.groups.length == 0) return true

        // Simple loop of check every item in groups for each this.groups
        // return true if anything matches
        for (let group=0; group<this.groups.length; group++) {
            if (groups.includes(this.groups[group])) return true
        }

        return false
    }

    // TODO: Exclude field to maybe not include the obvious 9A/9B for every lesson
    /**
     * Get the lessons title
     * @param {string[]} excludeGroups Groups to not show in the title
     * @returns {string}
     */
    getTitle(excludeGroups) {
        let showGroups = []
        for (let group=0; group<this.groups.length; group++) { 
            if (Array.isArray(excludeGroups) && excludeGroups.includes(this.groups[group])) continue
            showGroups.push(this.groups[group])
        }

        if (showGroups.length == 0) return this.name
        return `[${showGroups.join(",")}]: ${this.name}`
    }

    /**
     * Check if this is the current lesson
     * @param {Date} date The current time
     * @returns {boolean}
     */
    isCurrent(date) {
        const dateMilliseconds = date.getTime()

        // Or if it's before the start or after the end, return false
        if (dateMilliseconds < this.startMilliseconds || dateMilliseconds > this.endMilliseconds) return false;

        return true;
    }

    /**
     * Get the string for this lesson
     * @param {Date} date The current time
     * @param {boolean} includeAfter Include lesson even if it is after that lesson 
     * @param {string[]} excludeGroups Groups to not show in the title
     * @returns {string}
     */
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

    /**
     * Get a string for when the lesson is, instead of in how long
     * @param {string[]} excludeGroups Groups to not show in the title
     * @returns {string}
     */
    getTimeString(excludeGroups, endTime) {
        return `<span style="${this.styleData}"><b>${this.getTitle(excludeGroups)}</b> kl. <b>${this.getStartTimeString()}</b>${endTime? ` - <b>${this.getEndTimeString()}</b>`: ''}<br></span>`
    }

    getStartTimeString() {
        let tempDate = new Date()
        tempDate.setTime(this.startMilliseconds)
        return toTimeString(getInMilliseconds(tempDate), Math.floor, false)
    }

    getEndTimeString() {
        let tempDate = new Date()
        tempDate.setTime(this.endMilliseconds)
        return toTimeString(getInMilliseconds(tempDate), Math.floor, false)
    }
}

/**
 * Add a group to the groupList
 * @param {string[]} groupList List of groups
 * @param {string} group The group to add 
 */
function addGroup(groupList, group) {
    if (!groupList.includes(group)) {
        groupList.push(group)
    }
}

/**
 * Remove a group from the groupList
 * @param {string[]} groupList List of groups
 * @param {string} group The group to remove
 */
function removeGroup(groupList, group) {
    if (groupList.includes(group)) {
        groupList.splice(groupList.indexOf(group), 1)
    }
}

/**
 * Get the date of a lesson
 * @param {Date[]} seperators The start times of each week
 * @param {number} week The week of the lesson 
 * @param {number} weekday (0-6 where 0 is Monday) weekday of the lesson
 * @returns {Date}
 */
function getLessonDate(seperators, week, weekday) {
    let date = new Date(seperators[week])
    date.setDate(date.getDate() + weekday-1)
    return date
}

/**
 * Get epoch since the start of the date's current day
 * @param {Date} date 
 * @returns {number} milliseconds
 */
function getInMilliseconds(date) {
    return date.getHours()*60*60*1000 + date.getMinutes()*60*1000 + date.getSeconds()*1000 + date.getMilliseconds()
}

/**
 * Get the number week number of the date
 * @param {Date[]} seperators The start times of each week
 * @param {Date} date
 * @returns {number?} Null when date is past week list, -1 when before
 */
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

/**
 * The the week information for the date
 * @param {ScheduleEntry[][][]} schedule All week information
 * @param {Date[]} seperators The start times of each week
 * @param {*} date 
 * @returns {ScheduleEntry[][]?} Null when date is outside of week range
 */
function getThisWeek(schedule, seperators, date) {
    let week = getThisWeekNum(seperators, date)
    if (week ===null || week < 0) return null
    return schedule[week]
}

/**
 * Get the next day, week, and data with schedule data for the date
 * @param {ScheduleEntry[][][]} schedule All week information
 * @param {Date[]} seperators The start times of each week
 * @param {Date} date 
 * @returns {[number, number, ScheduleEntry[]]} [0] is -1 if there is no next day with lessons, don't use any values if this is -1 or [2] is an empty array
 */
function getNextDayWeek(schedule, seperators, date) {
    // Initialise variables for the start of counting
    let week = getThisWeekNum(seperators, date)
    let weekday = 0

    if (week === null) return [-1,0,[]]

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
            if (week>=schedule.length) return [-1,0,[]]
        }

        weekday++
        // Sunday is 0
        if (weekday>6) weekday = 0
    }

    // Return week, weekday, schedule
    return [week, weekday, schedule[week][weekday-1]]
}

// Credit: https://chat.openai.com/chat

/**
 * Creates a cookie
 * @param {string} name 
 * @param {any} value Converted to string 
 * @param {number?} days negative removes cookie, null sets no limit
 */
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

/**
 * Gets a cookie value
 * @param {string} name Name of the cookie
 * @returns {string?} Null if cookie does not exist
 */
function getCookie(name) {
    // Use the 'decodeURIComponent' function to decode the value of the cookie
    const decodedCookie = decodeURIComponent(document.cookie);

    // Create an array of all the name-value pairs in the cookie
    const pairs = decodedCookie.split(";");

    // Loop through the name-value pairs and return the value for the specified cookie name
    for (let pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
        const pair = pairs[pairIndex].split("=");
        if (pair[0].trim() == name) {
            return pair[1];
        }
    }
    return null;
}
  