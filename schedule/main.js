// @ts-nocheck

let testTime = null

$(document).ready(function() {
    document.body.innerHTML+='<h2 id="currentTitle"></h2><p id="current"></p><h2 id="laterTitle"></h2><p id="later"></p><h2 id="nextDayTitle"></h2><p id="nextDay"></p>'
    function render() {
        clearFields()
        let now = new Date()

        // For using a custom times instead of current time
        if (testTime !== null) now = testTime

        document.getElementById("time").innerHTML = toTimeString(getInMilliseconds(now), Math.floor, true)
        getToday(now)
        getNextDay(now)

        // Make the test time move
        if (testTime !== null) testTime = new Date(
            testTime.getFullYear(),
            testTime.getMonth(),
            testTime.getDate(),
            testTime.getHours(),
            testTime.getMinutes(),
            testTime.getSeconds(),
            testTime.getMilliseconds() + 500
        )
    }

    render()

    setInterval(render, 500)
})

function getToday(date) {
    // If it's not a school day we dont have a schedule to try and show
    if (date.getDay()-1 < 0 || date.getDay()-1>4) return

    const week = getThisWeek(date, currentSchedule);
    //console.table(week)
    //console.log(date.getDay())
    const lessons = week[date.getDay()-1]
    let outStr = ""
    for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].isCurrent(date)) {
            document.getElementById("currentTitle").innerHTML = "Just nu:"
            document.getElementById("current").innerHTML += lessons[i].getString(date, false)
            continue
        }
        outStr += lessons[i].getString(date, false)
    }
    if (outStr.length > 0) {
        document.getElementById("laterTitle").innerHTML = "Kommande:"
    }
    document.getElementById("later").innerHTML = outStr 
}

function getNextDay(date) {
    const days = [
        "Söndag",
        "Måndag",
        "Tisdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lördag",
    ]
    const weekAndDay = getNextDayWeek(date, currentSchedule)
    const week = weekAndDay[0]
    const weekday = weekAndDay[1]
    const lessons = weekAndDay[2]
    let outStr = ""
    for (let i = 0; i < lessons.length; i++) {
        outStr += lessons[i].getTimeString()
    }
    document.getElementById("nextDay").innerHTML = outStr
    if (outStr.length > 0) {
        let nextDate = week == "thisWeek"? new Date(lastWeekSeperator): new Date(weekSeperator)
        nextDate.setDate(nextDate.getDate() + weekday-1)
        document.getElementById("nextDayTitle").innerHTML = days[weekday]+" "+nextDate.getDate()+"/"+(nextDate.getMonth()+1)
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