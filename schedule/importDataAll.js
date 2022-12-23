// @ts-ignore
let allGroups = []

// @ts-ignore
let loading = 3

/**
 * @type {{thisWeek: ScheduleEntry[][], nextWeek: ScheduleEntry[][]}}
 */
// @ts-ignore
let schedule = {thisWeek: [], nextWeek: []}
// @ts-ignore
let currentSchedule = "__Fullt"
function loadSchedule() {
    fetch("schedule.json")
        .then(response => response.json())
        .then(data => {
            const tempSchedules = []
            function addWeek(scheduleWeek, weekData, weekName) {
                for (let i=0; i<weekData.length; i++){
                    let day = weekData[i]
                    scheduleWeek[i] = []
                    for (let j=0; j<day.length; j++){
                        let lesson = day[j]
                        scheduleWeek[i][j] = new ScheduleEntry(lesson[0], lesson[1], lesson[2], lesson[3], lesson[4], lesson[5], lesson[6], lesson[7], weekName)
                        for (let group=0; group<scheduleWeek[i][j].groups.length; group++) {
                            addGroup(allGroups, scheduleWeek[i][j].groups[group])
                        }
                    }
                }
                while(scheduleWeek.length < 7) scheduleWeek.push([])
            }
            for (let i=0; i<data.length; i++) {
                console.log("Adding schedule "+i+": "+data[i].name)
                tempSchedules[i] = {thisWeek: [], nextWeek: []}

                let thisWeek = data[i].thisWeek
                let nextWeek = data[i].nextWeek

                addWeek(tempSchedules[i].thisWeek, thisWeek, "thisWeek")
                addWeek(tempSchedules[i].nextWeek, nextWeek, "nextWeek")
            }

            schedule = tempSchedules[0]

            for (let i=1; i<tempSchedules.length; i++) {
                for (let j=0; j<schedule.thisWeek.length; j++) {
                    schedule.thisWeek[j] = mergeSchedules(schedule.thisWeek[j], tempSchedules[i].thisWeek[j])
                }
                for (let j=0; j<schedule.nextWeek.length; j++) {
                    schedule.nextWeek[j] = mergeSchedules(schedule.nextWeek[j], tempSchedules[i].nextWeek[j])
                }
            }

            loading--
        })
}

// @ts-ignore
const seperators = {}
fetch("date.json")
    .then(response => response.json())
    .then(data => {
        let entries = Object.entries(data)
        for (let i=0; i<entries.length; i++) {
            let key = entries[i][0]
            let value = entries[i][1]
            seperators[key] = new Date(value[0], value[1], value[2])
        }
        loadSchedule()
        loading--
    })

/*fetch("../groups.json")
    .then(response => response.json())
    .then(data => {
        for (let i=0; i< data.length; i++) {
            addGroup(allGroups, data[i])
        }
        loading--
    })*/
loading-- // Temporary replacement

