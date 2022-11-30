/**
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
    return `${h.toString().length == 1? "0"+h: h}:${m.toString().length == 1? "0"+m: m}${showSeconds? (":"+(s.toString().length == 1? "0"+s: s)): ""}`
}

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

    studentHas(groups) {
        if (this.groups.length == 0) return true
        for (let i=0; i<this.groups.length; i++) {
            for (let i2=0; i2<groups.length; i2++) {
                if (groups[i2] == this.groups[i]) return true
            }
        }
        return false
    }

    getTitle() {
        if (this.groups.length == 0) return this.name
        return `[${this.groups.join(",")}]: ${this.name}`
    }

    /**
     * @param {Date} date 
     */
    isCurrent(date) {
        if (date.getDay()-1 != this.weekday) return false;
        const dateMilliseconds = getInMilliseconds(date)
        if (dateMilliseconds < this.startMilliseconds || dateMilliseconds > this.endMilliseconds) return false;
        return true;
    }

    getString(date, includeAfter) {
        if (this.isCurrent(date)) {
            return `<b>${this.getTitle()}</b> slutar om <b>${toTimeString(this.endMilliseconds - getInMilliseconds(date), Math.ceil, true)}</b><br>`
        }
        if (getInMilliseconds(date) < this.startMilliseconds) {
            return `<b>${this.getTitle()}</b> börjar om <b>${toTimeString(this.startMilliseconds - getInMilliseconds(date), Math.ceil, true)}</b><br>`
        }
        if (getInMilliseconds(date) > this.endMilliseconds && includeAfter) {
            return `<b>${this.getTitle()}</b> slutate <b>${toTimeString(getInMilliseconds(date) - this.endMilliseconds, Math.ceil, true)}</b> sedan<br>`
        }
        return ""
    }

    getTimeString() {
        return `<b>${this.getTitle()}</b> kl. <b>${toTimeString(this.startMilliseconds, Math.floor, false)}</b><br>`
    }
}