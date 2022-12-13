// @ts-nocheck

let testTime = null
let run_scripts = true

$(document).ready(function() {
    // Add generic content for all pages
    document.body.innerHTML+=`<h1>Metapontum ${currentSchedule} Schema <span id="date"></span> kl. <span id="time">00:00:00</span></h1><p>För tillfället använder vi namnen direkt från schoolsoft, men detta går att ändra om vi vill</p>`
    document.body.innerHTML+='<h2 id="currentTitle"></h2><p id="current"></p><h2 id="laterTitle"></h2><p id="later"></p><h2 id="nextDayTitle"></h2><p id="nextDay"></p>'
    document.body.innerHTML+='<h2>Stop är användbart för att kopiera text</h2><button id="start_scripts">Start</button><button id="stop_scripts">Stop</button>'
    // Add callbacks to buttons
    $("#start_scripts").click(function(){run_scripts=true})
    $("#stop_scripts").click(function(){run_scripts=false})

    // Refresh all dynamic fields
    function render() {

        // We have paused (usefull for people who want to copy paste something), return
        if (!run_scripts) return

        clearFields()

        let now = new Date()
        // For using a custom times instead of current time (testing)
        if (testTime !== null) now = testTime

        // Update clock
        document.getElementById("time").innerHTML = toTimeString(getInMilliseconds(now), Math.floor, true)
        document.getElementById("date").innerHTML = now.getDate()+"/"+(now.getMonth()+1)

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

    // First render
    render()
    // Repeat every 0.5 seconds
    setInterval(render, 500)
})

// Display the content for today
function getToday(date) {
    // If it's not a school day we dont have a schedule to try and show
    if (date.getDay()-1 < 0 || date.getDay()-1>4) return

    // Get lessons for this week
    const week = getThisWeek(date, currentSchedule);
    const lessons = week[date.getDay()-1]

    let outStr = ""

    // We don't want to show previous lessons because they aren't relevant
    let _showPrevious = false

    // Add all lessons to the output
    for (let i = 0; i < lessons.length; i++) {
        // Extra case for the current lesson
        if (lessons[i].isCurrent(date)) {
            document.getElementById("currentTitle").innerHTML = "Just nu:"
            document.getElementById("current").innerHTML += lessons[i].getString(date, _showPrevious)
            continue
        }

        // Generic lesson
        outStr += lessons[i].getString(date, _showPrevious)
    }

    // If we added anything, add a title
    if (outStr.length > 0) {
        document.getElementById("laterTitle").innerHTML = "Kommande:"
    }

    document.getElementById("later").innerHTML = outStr 
}

// Display the content for the next day
function getNextDay(date) {
    // Weekdays in swedish (Why does 0=sunday in this :c)
    const days = [
        "Söndag",
        "Måndag",
        "Tisdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lördag",
    ]

    // Get when the next day with lessons actually is
    const weekAndDay = getNextDayWeek(date, currentSchedule)
    const week = weekAndDay[0]
    const weekday = weekAndDay[1]
    const lessons = weekAndDay[2]

    let outStr = ""

    // Add all lessons to the output
    for (let i = 0; i < lessons.length; i++) {
        outStr += lessons[i].getTimeString()
    }
    document.getElementById("nextDay").innerHTML = outStr

    // If we did output anything, add a title
    if (outStr.length > 0) {
        // Get the date 
        let nextDate = week == "thisWeek"? new Date(lastWeekSeperator): new Date(weekSeperator)
        nextDate.setDate(nextDate.getDate() + weekday-1)

        // Set the title to `${weekday} {date}/{month}`
        document.getElementById("nextDayTitle").innerHTML = days[weekday]+" "+nextDate.getDate()+"/"+(nextDate.getMonth()+1)
    }
}

// Clear all fields to that they are ready for new content
function clearFields() {
    document.getElementById("currentTitle").innerHTML = ""
    document.getElementById("current").innerHTML = ""
    document.getElementById("laterTitle").innerHTML = ""
    document.getElementById("later").innerHTML = ""
    document.getElementById("nextDayTitle").innerHTML = ""
    document.getElementById("nextDay").innerHTML = ""
}