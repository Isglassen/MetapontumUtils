//@ts-nocheck

// Paste this into the browser to generate middleGround ScheduleEntry JSON
// that can the be used to construct ScheduleEntries

// TODO: Make check so that multiple lessons at the same time work

// Get schedule table
const scheduleTable = document.getElementById("schedule_cont_content").children[1].children[0]

let rowspans = [
    0,
    0,
    0,
    0,
    0,
]

function addObject(weekDay, dataString) {
    console.log(weekDay, dataString)
}

for (let i = 1; i < scheduleTable.children.length; i++) {
    for (let i2 = 0; i2 < scheduleTable.children[i].children.length; i2++) {
        const entry = scheduleTable.children[i].children[i2]

        // Check if entry is a time lable
        if (entry.width == "5%") continue

        let weekday = 0
        
        // Check the weekday of the entry
        for (let i3 = 0; i3 < rowspans.length; i3++) {
            console.log("rowspan "+i3+" is at "+rowspans[i3]+" needed: "+i)
            weekday = i3
            console.log(weekday, i3)
            if (rowspans[i3] < i) {
                console.log("Selected "+weekday)
                break
            }
        }

        console.log(weekday)

        rowspans[weekday] += entry.rowSpan

        // Don't add empty cells
        if (entry.classList.contains("light")) continue

        $(entry.children[1]).focus()
        addObject(weekday, entry.children[0].title)
    }
}