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

// Get epoch since the start of the dates current day
function getInMilliseconds(date) {
    return date.getHours()*60*60*1000 + date.getMinutes()*60*1000 + date.getSeconds()*1000 + date.getMilliseconds()
}

class ScheduleEntry {
    constructor(groups, name, weekday, startHour, startMinute, endHour, endMinute) {
        this.groups = groups
        this.name = name
        this.weekday = weekday
        this.startMilliseconds = startHour*60*60*1000 + startMinute*60*1000
        this.endMilliseconds = endHour*60*60*1000 + endMinute*60*1000
    }

    // Checks if a studentss group list is in this lessons list
    studentHas(groups) {
        // If there is no group list then everyone matches
        if (this.groups.length == 0) return true

        // Simple loop of check every item in groups for each this.groups
        // return true if anything matches
        for (let i=0; i<this.groups.length; i++) {
            for (let i2=0; i2<groups.length; i2++) {
                if (groups[i2] == this.groups[i]) return true
            }
        }

        return false
    }

    // Get the lessons title
    // TODO: Exclude field to maybe not include the obvious 9A/9B for every lesson
    getTitle() {
        if (this.groups.length == 0) return this.name
        return `[${this.groups.join(",")}]: ${this.name}`
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
    getString(date, includeAfter) {
        if (this.isCurrent(date)) {
            // Current lesson string
            return `<b>${this.getTitle()}</b> slutar om <b>${toTimeString(this.endMilliseconds - getInMilliseconds(date), Math.ceil, true)}</b><br>`
        }
        if (getInMilliseconds(date) < this.startMilliseconds) {
            // Future lesson string
            return `<b>${this.getTitle()}</b> börjar om <b>${toTimeString(this.startMilliseconds - getInMilliseconds(date), Math.ceil, true)}</b><br>`
        }
        if (getInMilliseconds(date) > this.endMilliseconds && includeAfter) {
            // Past lesson string (if we include lessons after they end)
            return `<b>${this.getTitle()}</b> slutate <b>${toTimeString(getInMilliseconds(date) - this.endMilliseconds, Math.ceil, true)}</b> sedan<br>`
        }
        // We don't include the lesson
        return ""
    }

    // Get a string for when the lesson is, instead of in how long
    getTimeString() {
        return `<b>${this.getTitle()}</b> kl. <b>${toTimeString(this.startMilliseconds, Math.floor, false)}</b><br>`
    }
}