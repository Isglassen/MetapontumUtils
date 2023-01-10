//@ts-nocheck

const settings = new Settings()
let testTime = null
let run_scripts = true

settings.addSetting("groups", settings.jsonType.copy("student_groups"), settings.jsonType.copy("groups"), [])
settings.addSetting("showPrevious", settings.boolType.copy("show_previous"), settings.boolType.copy("showPrevious"), false)
settings.addSetting("futureCountdown", settings.boolType.copy("future_countdown"), settings.boolType.copy("futureCountdown"), false)

// Refresh all dynamic fields
function render() {

    // If we have paused (usefull for people who want to copy paste something), return
    if (!run_scripts) return

    clearFields()

    let now = new Date()
    // For using a custom times instead of current time (testing)
    if (testTime !== null) now = testTime

    // Update clock
    document.getElementById("time").innerHTML = toTimeString(getInMilliseconds(now), Math.floor, true)
    document.getElementById("date").innerHTML = now.getDate()+"/"+(now.getMonth()+1)

    if (seperators.length<schedule.length) {
        console.error("Not enough seperators for every week")
        document.getElementById("current").innerHTML += "<kbd>Datan verkar vara dåligt formaterad, vänligen kontakta utvecklaren</kbd>"
        return
    }

    try {
        getToday(now)
        getNextDay(now)
    }
    catch(err) {
        console.error(err)
        document.getElementById("current").innerHTML += "<kbd>Något gick fel. Datan var förmodligen dåligt formaterad. Vänligen kontakta utvecklaren</kbd>"
        return
    }

    // Make the test time move
    if (testTime !== null) testTime.setMilliseconds(testTime.getMilliseconds()+500)
}

let allGroups, schedule, currentSchedule, seperators

$(document).ready(async function() {
    // Add generic content for all pages
    document.body.innerHTML+='<h1>Metapontum <span id="scheduleName"></span> Schema <span id="date"></span> kl. <span id="time">00:00:00</span></h1><p>För tillfället använder vi namnen direkt från schoolsoft, men detta går att ändra om vi vill</p>'
    document.body.innerHTML+='<h2 id="previousTitle"></h2><p class="lessons" id="previous"></p><h2 id="currentTitle"></h2><p class="lessons" id="current"><kbd>Laddar...</kbd></p><h2 id="laterTitle"></h2><p class="lessons" id="later"></p><h2 id="nextDayTitle"></h2><p class="lessons" id="nextDay"></p>'
    document.body.innerHTML+='<h2><kbd>Stoppa Script</kbd> är användbart för att kopiera text</h2><button id="toggle_scripts"></button><button id="toggle_previous"></button><button id="toggle_future_countdown"></button>'
    document.body.innerHTML+='<br/><p>Grupper: </p><div id="group_select"></div>'
    document.body.innerHTML+='<br/><br/>Inställningar är: <kbd>Visa Tidigare</kbd>, <kbd>Grupper</kbd>, <kbd>Visning av nästa dag</kbd><br/><button id="cookie_save">Spara inställningar (cookies)</button><button id="cookie_remove">Glöm cookies</button>'

    // Set button names
    try {
        document.getElementById("toggle_scripts").innerHTML = run_scripts? "Stoppa Script": "Starta Script"
        document.getElementById("toggle_previous").innerHTML = settings.get("showPrevious")? "Dölj Tidigare": "Visa Tidigare"
        document.getElementById("toggle_future_countdown").innerHTML = settings.get("futureCountdown")? "Visa klockslag för nästa dag": "Visa nedräkningar för nästa dag"
    } catch(err) {
        console.error(err)
    }

    // Add callbacks to buttons
    $("#toggle_scripts").click(() => {
        run_scripts=!run_scripts
        document.getElementById("toggle_scripts").innerHTML = run_scripts? "Stoppa Script": "Starta Script"
    })
    $("#toggle_previous").click(() => {
        settings.set("showPrevious", !settings.get("showPrevious"))
        document.getElementById("toggle_previous").innerHTML = settings.get("showPrevious")? "Dölj Tidigare": "Visa Tidigare"
    })
    $("#toggle_future_countdown").click(() => {
        settings.set("futureCountdown", !settings.get("futureCountdown"))
        document.getElementById("toggle_future_countdown").innerHTML = settings.get("futureCountdown")? "Visa klockslag för nästa dag": "Visa nedräkningar för nästa dag"
    })
    $("#cookie_save").click(() => {
        settings.saveCookies()
    })
    $("#cookie_remove").click(() => {
        settings.removeCookies()
    })

    console.group("Loading");
    ({ allGroups, schedule, currentSchedule, seperators } = await loadFn());
    console.log("Loaded");
    console.groupEnd();

    let groupList = settings.get("groups")
    if (!currentSchedule.startsWith("__")) { if (!(currentSchedule === "")) addGroup(groupList, currentSchedule) }
    if (currentSchedule.startsWith("__")) currentSchedule = currentSchedule.substring(2)
    settings.set("groups", groupList)
    document.getElementById("scheduleName").innerHTML = currentSchedule
    document.head.innerHTML+=`<title>${currentSchedule} Schema</title>`
    let groupSelectStr = ""
    for (let groupIndex=0; groupIndex<allGroups.length; groupIndex++) {
        let group = allGroups[groupIndex]
        groupSelectStr += `<br/><group-option data-name="${group}" data-selected="${settings.get("groups").includes(group)? 1: 0}">${group}</group-option>`
    }
    document.getElementById("group_select").innerHTML += groupSelectStr
    let groupOptions = document.getElementsByTagName("group-option")
    for (let option=0; option<groupOptions.length; option++) {
        $(groupOptions[option]).click((e) => {
            let target = e.delegateTarget
            if (!("selected" in target.dataset)) {
                target.dataset.selected = "1"
                let groupList = settings.get("groups")
                addGroup(groupList, target.dataset.name)
                settings.set("groups", groupList)
                return
            }
            if (target.dataset.selected == "1") {
                target.dataset.selected = "0"
                let groupList = settings.get("groups")
                removeGroup(groupList, target.dataset.name)
                settings.set("groups", groupList)
                return
            }
            target.dataset.selected = "1"
            let groupList = settings.get("groups")
            addGroup(groupList, target.dataset.name)
            settings.set("groups", groupList)
        })
    }

    // First render
    render()
    // Repeat every 0.5 seconds (smaller number=more exact)
    setInterval(render, 500)
})

// Display the content for today
function getToday(date) {
    // Get lessons for this week
    const week = getThisWeek(schedule, seperators, date);
    if (week === null) return

    const lessons = week[(date.getDay()-1<0? 6: date.getDay()-1)]

    let outPrevious = ""
    let outCurrent = ""
    let outFuture = ""

    // Add all lessons to the output
    for (let lesson = 0; lesson < lessons.length; lesson++) {
        if (!lessons[lesson].studentHas(settings.get("groups"))) continue

        if (lessons[lesson].endMilliseconds < date.getTime()) {
            outPrevious += lessons[lesson].getString(date, settings.get("showPrevious"), [currentSchedule])
            continue
        }

        if (lessons[lesson].isCurrent(date)) {
            outCurrent += lessons[lesson].getString(date, settings.get("showPrevious"), [currentSchedule])
            continue
        }

        outFuture += lessons[lesson].getString(date, settings.get("showPrevious"), [currentSchedule])
    }

    // If we added anything to a category, add a title
    if (outPrevious.length > 0 && settings.get("showPrevious")) {
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
    const weekAndDay = getNextDayWeek(schedule, seperators, date)
    const week = weekAndDay[0]
    const weekday = weekAndDay[1]
    const lessons = weekAndDay[2]

    let outStr = ""

    // Add all lessons to the output
    for (let lesson = 0; lesson < lessons.length; lesson++) {
        if (!lessons[lesson].studentHas(settings.get("groups"))) continue

        if (settings.get("futureCountdown")) outStr += lessons[lesson].getString(date, settings.get("showPrevious"), [currentSchedule])
        else outStr += lessons[lesson].getTimeString([currentSchedule])
    }
    document.getElementById("nextDay").innerHTML = outStr

    // If we did output anything, add a title
    if (outStr.length > 0) {
        // Get the date
        let nextDate = getLessonDate(seperators, week, weekday)

        // Set the title to `${weekday} {date}/{month}`
        document.getElementById("nextDayTitle").innerHTML = days[weekday]+" "+nextDate.getDate()+"/"+(nextDate.getMonth()+1)+"/"+nextDate.getFullYear()
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