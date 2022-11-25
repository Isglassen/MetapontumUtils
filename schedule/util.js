function toTimeString(milliseconds, includeSeconds=true) {
    const h = Math.floor(milliseconds/(60*60*1000))
    const m = Math.floor((milliseconds-(h*60*60*1000))/(60*1000))
    const s = Math.floor((milliseconds-(h*60*60*1000)-(m*60*1000))/(1000))
    return (h.toString().length == 1? "0"+h: h)+":"+
    (m.toString().length == 1? "0"+m: m)+(includeSeconds? (":"+
    (s.toString().length == 1? "0"+s: s)): "")
}

function getInMilliseconds(date) {
    return date.getHours()*60*60*1000 + date.getMinutes()*60*1000 + date.getSeconds()*1000 + date.getMilliseconds()
}

class ScheduleEntry {
    constructor(name, weekday, startHour, startMinute, endHour, endMinute) {
        this.name = name
        this.weekday = weekday
        this.startMilliseconds = startHour*60*60*1000 + startMinute*60*1000
        this.endMilliseconds = endHour*60*60*1000 + endMinute*60*1000
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
            return "<b>" + this.name + "</b> slutar om <b>" + toTimeString(this.endMilliseconds - getInMilliseconds(date)) + "</b><br>"
        }
        if (getInMilliseconds(date) < this.startMilliseconds) {
            return "<b>" + this.name + "</b> börjar om <b>" + toTimeString(this.startMilliseconds - getInMilliseconds(date)) + "</b><br>"
        }
        if (getInMilliseconds(date) > this.endMilliseconds && includeAfter) {
            return "<b>" + this.name + "</b> slutate <b>" + toTimeString(getInMilliseconds(date) - this.endMilliseconds) + "</b> sedan<br>"
        }
        return ""
    }

    getTimeString() {
        return "<b>"+ this.name + "</b> kl. <b>" + toTimeString(this.startMilliseconds, false) + "</b><br>"
    }
}