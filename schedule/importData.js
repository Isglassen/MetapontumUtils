let allGroups = []

let loading = 3

const seperators = {}
fetch("../date.json")
    .then(response => response.json())
    .then(data => {
        let entries = Object.entries(data)
        for (let i=0; i<entries.length; i++) {
            let key = entries[i][0]
            let value = entries[i][1]
            seperators[key] = new Date(value[0], value[1], value[2])
        }
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

/**
 * @type {{thisWeek: ScheduleEntry[][], nextWeek: ScheduleEntry[][]}}
 */
const schedule = {thisWeek: [], nextWeek: []}
let currentSchedule = ""
fetch("schedule.json")
    .then(response => response.json())
    .then(data => {
        function addWeek(scheduleWeek, weekData) {
            for (let i=0; i<weekData.length; i++){
                let day = weekData[i]
                scheduleWeek[i] = []
                for (let j=0; j<day.length; j++){
                    let lesson = day[j]
                    scheduleWeek[i][j] = new ScheduleEntry(lesson[0], lesson[1], lesson[2], lesson[3], lesson[4], lesson[5], lesson[6], lesson[7])
                    for (let group=0; group<scheduleWeek[i][j].groups.length; group++) {
                        addGroup(allGroups, scheduleWeek[i][j].groups[group])
                    }
                }
            }
            while(scheduleWeek.length < 7) scheduleWeek.push([])
        }

        currentSchedule = data.name
        let thisWeek = data.thisWeek
        let nextWeek = data.nextWeek
        
        addWeek(schedule.thisWeek, thisWeek)
        addWeek(schedule.nextWeek, nextWeek)

        loading--
    })