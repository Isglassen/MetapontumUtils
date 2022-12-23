function addWeek(scheduleWeek, weekData, weekName, dataObj) {
    for (let i=0; i<weekData.length; i++){
        let day = weekData[i]
        scheduleWeek[i] = []
        for (let j=0; j<day.length; j++){
            let lesson = day[j]
            scheduleWeek[i][j] = new ScheduleEntry(lesson[0], lesson[1], lesson[2], lesson[3], lesson[4], lesson[5], lesson[6], lesson[7], weekName, dataObj.seperators)
            for (let group=0; group<scheduleWeek[i][j].groups.length; group++) {
                addGroup(dataObj.allGroups, scheduleWeek[i][j].groups[group])
            }
        }
    }
    while(scheduleWeek.length < 7) scheduleWeek.push([])
}

async function loadSchedule(dataObj, schedulePath) {
    let data = await (await fetch(schedulePath)).json()

    if (!Array.isArray(data)) {data = [data]} 

    const tempSchedules = []
    for (let i=0; i<data.length; i++) {
        console.log("Adding schedule "+i+": "+data[i].name)
        tempSchedules[i] = {thisWeek: [], nextWeek: []}

        let thisWeek = data[i].thisWeek
        let nextWeek = data[i].nextWeek

        addWeek(tempSchedules[i].thisWeek, thisWeek, "thisWeek", dataObj)
        addWeek(tempSchedules[i].nextWeek, nextWeek, "nextWeek", dataObj)
    }

    dataObj.schedule = tempSchedules[0]

    for (let i=1; i<tempSchedules.length; i++) {
        for (let j=0; j<dataObj.schedule.thisWeek.length; j++) {
            dataObj.schedule.thisWeek[j] = mergeSchedules(dataObj.schedule.thisWeek[j], tempSchedules[i].thisWeek[j])
        }
        for (let j=0; j<dataObj.schedule.nextWeek.length; j++) {
            dataObj.schedule.nextWeek[j] = mergeSchedules(dataObj.schedule.nextWeek[j], tempSchedules[i].nextWeek[j])
        }
    }

    dataObj.loading = false
}

async function loadDate(dataObj, datePath, schedulePath) {
    let data = await (await fetch(datePath)).json()
    let entries = Object.entries(data)
    for (let i=0; i<entries.length; i++) {
        let key = entries[i][0]
        let value = entries[i][1]
        dataObj.seperators[key] = new Date(value[0], value[1], value[2])
    }
    await loadSchedule(dataObj, schedulePath)
}

async function loadData(groupPath, datePath, schedulePath) {
    let dataObj = {allGroups: [], schedule: [], currentSchedule: "", seperators: {}, loading: true}
    let data = await (await fetch(groupPath)).json()
    for (let i=0; i< data.length; i++) {
        addGroup(dataObj.allGroups, data[i])
    }
    await loadDate(dataObj, datePath, schedulePath)
    return dataObj
}