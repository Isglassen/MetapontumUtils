// @ts-nocheck

let testTime = null
let run_scripts = true
const previous_cookie = getCookie("show_previous")
let show_previous = getCookie("show_previous") === "1"
let groups = JSON.parse(getCookie("student_groups"))
if (groups === null) groups = []
let loaded = false

$(document).ready(function() {
    // Add generic content for all pages
    document.head.innerHTML+='<link rel="icon" type="image/x-icon" href="../../assets/images/favicon.ico"><link rel="stylesheet" href="../style.css">'

    document.body.innerHTML+='<h1>Metapontum <span id="scheduleName"></span> Schema <span id="date"></span> kl. <span id="time">00:00:00</span></h1><p>För tillfället använder vi namnen direkt från schoolsoft, men detta går att ändra om vi vill</p>'
    document.body.innerHTML+='<h2 id="previousTitle"></h2><p class="lessons" id="previous"></p><h2 id="currentTitle"></h2><p class="lessons" id="current"></p><h2 id="laterTitle"></h2><p class="lessons" id="later"></p><h2 id="nextDayTitle"></h2><p class="lessons" id="nextDay"></p>'
    document.body.innerHTML+='<h2>Stop är användbart för att kopiera text</h2><button id="start_scripts">Start</button><button id="stop_scripts">Stop</button><br/><button id="toggle_previous">Visa Tidigare</button>'
    document.body.innerHTML+='<br/><p>Grupper: </p><div id="group_select"></div>'
    document.body.innerHTML+='<br/><br/>Inställningar är: <kbd>Visa Tidigare</kbd>, <kbd>Grupper</kbd><br/><button id="cookie_save">Spara inställningar (cookies)</button><button id="cookie_remove">Glöm cookies</button>'

    document.getElementById("toggle_previous").innerHTML = show_previous? "Dölj Tidigare": "Visa Tidigare"
    // Add callbacks to buttons
    $("#start_scripts").click(function() {run_scripts=true})
    $("#stop_scripts").click(function() {run_scripts=false})
    $("#toggle_previous").click(function() {
        show_previous = !show_previous
        document.getElementById("toggle_previous").innerHTML = show_previous? "Dölj Tidigare": "Visa Tidigare"
    })
    $("#cookie_save").click(function() {
        createCookie("show_previous", +show_previous)
        createCookie("student_groups", JSON.stringify(groups))
    })
    $("#cookie_remove").click(function() {
        createCookie("show_previous", null, -1)
        createCookie("student_groups", null, -1)
    })

    function afterLoad() {
        document.getElementById("scheduleName").innerHTML = currentSchedule
        addGroup(groups, currentSchedule)
        document.head.innerHTML+=`<title>${currentSchedule} Schema</title>`
        groupSelectStr = ""
        for (let i=0; i<allGroups.length; i++) {
            group = allGroups[i]
            groupSelectStr += `<br/><group-option data-name="${group}"`
            if (groups.includes(group)) groupSelectStr += ' data-selected="1"'
            groupSelectStr += `>${group}</group-option>`
        }
        document.getElementById("group_select").innerHTML += groupSelectStr
        options = document.getElementsByTagName("group-option")
        for (let i=0; i<options.length; i++) {
            $(options[i]).click(function(e) {
                let target = e.delegateTarget
                console.log(groups)
                console.log(target.dataset.selected)
                console.log(target.dataset.name)
                if (!("selected" in target.dataset)) {
                    target.dataset.selected = "1"
                    addGroup(groups, target.dataset.name)
                    return
                }
                if (target.dataset.selected == "1") {
                    target.dataset.selected = "0"
                    removeGroup(groups, target.dataset.name)
                    return
                }
                target.dataset.selected = "1"
                addGroup(groups, target.dataset.name)
            })
        }
        loaded = true
    }

    // Refresh all dynamic fields
    function render() {

        // We have paused (usefull for people who want to copy paste something), return
        if (!run_scripts) return

        clearFields()

        if (loading) {
            document.getElementById("current").innerHTML = "<kbd>Loading...</kbd>"
            return
        }

        if (!loaded) afterLoad()

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
    // Repeat every 0.5 seconds (smaller number=more exact)
    setInterval(render, 500)
})

// Display the content for today
function getToday(date) {
    // If it's not a school day we dont have a schedule to try and show
    if (date.getDay()-1 < 0 || date.getDay()-1>4) return

    // Get lessons for this week
    const week = getThisWeek(date, currentSchedule);
    const lessons = week[date.getDay()-1]

    let outPrevious = ""
    let outCurrent = ""
    let outFuture = ""

    // Add all lessons to the output
    for (let i = 0; i < lessons.length; i++) {
        if (!lessons[i].studentHas(groups)) continue

        if (lessons[i].endMilliseconds < getInMilliseconds(date)) {
            outPrevious += lessons[i].getString(date, show_previous, [currentSchedule])
            continue
        }

        if (lessons[i].isCurrent(date)) {
            outCurrent += lessons[i].getString(date, show_previous, [currentSchedule])
            continue
        }

        outFuture += lessons[i].getString(date, show_previous, [currentSchedule])
    }

    // If we added anything to a category, add a title
    if (outPrevious.length > 0 && show_previous) {
        document.getElementById("previousTitle").innerHTML = "Tidigare:"
        document.getElementById("previous").innerHTML = outPrevious
    }

    if (outCurrent.length > 0) {
        document.getElementById("currentTitle").innerHTML = "Just nu:"
        document.getElementById("current").innerHTML = outCurrent
    }

    if (outFuture.length > 0) {
        document.getElementById("laterTitle").innerHTML = "Kommande:"
        document.getElementById("later").innerHTML = outFuture 
    }
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
        if (!lessons[i].studentHas(groups)) continue

        outStr += lessons[i].getTimeString([currentSchedule])
    }
    document.getElementById("nextDay").innerHTML = outStr

    // If we did output anything, add a title
    if (outStr.length > 0) {
        // Get the date 
        let nextDate = week == "thisWeek"? new Date(seperators.lastWeek): new Date(seperators.thisWeek)
        nextDate.setDate(nextDate.getDate() + weekday-1)

        // Set the title to `${weekday} {date}/{month}`
        document.getElementById("nextDayTitle").innerHTML = days[weekday]+" "+nextDate.getDate()+"/"+(nextDate.getMonth()+1)
    }
}

// Clear all fields to that they are ready for new content
function clearFields() {
    document.getElementById("previousTitle").innerHTML = ""
    document.getElementById("previous").innerHTML = ""  
    document.getElementById("currentTitle").innerHTML = ""
    document.getElementById("current").innerHTML = ""
    document.getElementById("laterTitle").innerHTML = ""
    document.getElementById("later").innerHTML = ""
    document.getElementById("nextDayTitle").innerHTML = ""
    document.getElementById("nextDay").innerHTML = ""
}