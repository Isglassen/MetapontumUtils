// @ts-nocheck

$(document).ready(function() {
    function render() {
        clearFields()
        const now = new Date()
        getToday(now)
        getNextDay(now)
    }

    render()

    setInterval(() => {
        render
    }, 500)
})

function getToday(date) {
    const week = getThisWeek9A(date);
    //console.table(week)
    //console.log(now.getDay())
    const lessons = week[date.getDay()-1]
    let outStr = ""
    for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].isCurrent(date)) {
            document.getElementById("laterTitle").innerHTML = "Next:"
            document.getElementById("later").innerHTML += lessons[i].getString(date, false)
        }
        outStr += lessons[i].getString(date, false)
    }
    if (outStr.length > 0) {
        document.getElementById("currentTitle").innerHTML = "Upcoming:"
    }
    document.getElementById("current").innerHTML = outStr 
}

function getNextDay(date) {
    const days = [
        "Sunday:",
        "Monday:",
        "Tuesday:",
        "Wednesday:",
        "Thursday:",
        "Friday:",
        "Saturday:",
    ]
    const weekDay = getNextDayWeek9A(date)
    const week = weekDay[0]
    const weekday = weekDay[1]
    const lessons = week[weekday-1]
    let outStr = ""
    for (let i = 0; i < lessons.length; i++) {
        outStr += lessons[i].getTimeString()
    }
    document.getElementById("nextDay").innerHTML = outStr
    if (outStr.length > 0) {
        document.getElementById("nextDayTitle").innerHTML = days[weekday]
    }
}

function clearFields() {
    document.getElementById("currentTitle").innerHTML = ""
    document.getElementById("current").innerHTML = ""
    document.getElementById("laterTitle").innerHTML = ""
    document.getElementById("later").innerHTML = ""
    document.getElementById("nextDayTitle").innerHTML = ""
    document.getElementById("nextDay").innerHTML = ""
}