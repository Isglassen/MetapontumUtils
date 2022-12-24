/**
 * Add a week to the schedule
 * @param {ScheduleEntry[][]} scheduleWeek The empty week to insert into
 * @param {[string, string, number, number, number, number, number, string][][]} weekData The data for the week
 * @param {number} weekNum This weeks number
 * @param {{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}} dataObj Must have seperators filled in
 */
function addWeek(scheduleWeek, weekData, weekNum, dataObj) {
    for (let dayIndex=0; dayIndex<weekData.length; dayIndex++){
        let day = weekData[dayIndex]
        scheduleWeek[dayIndex] = []
        for (let lessonIndex=0; lessonIndex<day.length; lessonIndex++){
            let lesson = day[lessonIndex]
            scheduleWeek[dayIndex][lessonIndex] = new ScheduleEntry(lesson[0], lesson[1], lesson[2], lesson[3], lesson[4], lesson[5], lesson[6], lesson[7], weekNum, dataObj.seperators)
            for (let group=0; group<scheduleWeek[dayIndex][lessonIndex].groups.length; group++) {
                addGroup(dataObj.allGroups, scheduleWeek[dayIndex][lessonIndex].groups[group])
            }
        }
    }
    while(scheduleWeek.length < 7) scheduleWeek.push([])
}

/**
 * Loads schedule data into tempSchedules
 * @param {{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}} dataObj Must have seperators filled in
 * @param {string} schedulePath 
 * @param {boolean} firstItr If this is the first iteration
 * @param {ScheduleEntry[][][][]} tempSchedules 
 * @param {number} offset Start offset to use in tempSchedules 
 */
async function loadSchedulePart(dataObj, schedulePath, firstItr, tempSchedules, offset) {
    /**
     * @type {{name: string, schedule: [string, string, number, number, number, number, number, string][][][]}|({name: string, schedule: [string, string, number, number, number, number, number, string][][][]}|string)[]}
     */
    let data = await (await fetch(schedulePath)).json()

    if (!Array.isArray(data)) {if (firstItr) {dataObj.currentSchedule = data.name} data = [data]}

    for (let schedule=0; schedule<data.length; schedule++) {
        if (typeof(data[schedule])==="string") {
            /**
             * @type {string}
             */
            // @ts-ignore
            let otherPath = data[schedule]
            console.group("Importing schedule from "+data[schedule])
            await loadSchedulePart(dataObj, otherPath, false, tempSchedules, schedule+offset)
            console.groupEnd()
            continue
        }
        /**
         * @type {{name: string, schedule: [string, string, number, number, number, number, number, string][][][]}}
         */
        // @ts-ignore
        let scheduleData = data[schedule]
        console.log("Adding schedule "+(schedule+offset)+": "+scheduleData.name)
        tempSchedules[schedule+offset] = [[]]

        for (let week=0; week<scheduleData.schedule.length; week++) {
            tempSchedules[schedule+offset][week] = []
            addWeek(tempSchedules[schedule+offset][week], scheduleData.schedule[week], week, dataObj)
        }
    }
}

/**
 * Loads schedule data into dataObj
 * @param {{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}} dataObj Must have seperators filled in
 * @param {string} schedulePath
 */
async function loadSchedule(dataObj, schedulePath) {
    const tempSchedules = []

    await loadSchedulePart(dataObj, schedulePath, true, tempSchedules, 0)

    dataObj.schedule = tempSchedules[0]

    for (let schedule=1; schedule<tempSchedules.length; schedule++) {
        for (let week=0; week<dataObj.schedule.length; week++) {
            for (let day=0; day<dataObj.schedule[week].length; day++) {
                dataObj.schedule[week][day] = mergeDaySchedules(dataObj.schedule[week][day], tempSchedules[schedule][week][day])
            }
        }
    }
}

/**
 * Loads date data into dataObj
 * @param {{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}} dataObj 
 * @param {string} datePath 
 */
async function loadDate(dataObj, datePath) {
    /**
     * @type {[number, number, number][]}
     */
    let data = await (await fetch(datePath)).json()
    for (let seperator=0; seperator<data.length; seperator++) {
        dataObj.seperators[seperator] = new Date(data[seperator][0], data[seperator][1], data[seperator][2])
    }
}

/**
 * Loads group data into dataObj 
 * @param {{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}} dataObj
 * @param {*} groupPath
 */
async function loadGroups(dataObj, groupPath) {
    /**
     * @type {string[]}
     */
    let data = await (await fetch(groupPath)).json()
    for (let group=0; group< data.length; group++) {
        addGroup(dataObj.allGroups, data[group])
    }
}

/**
 * Load data from the paths
 * @param {string} groupPath 
 * @param {string} datePath 
 * @param {string} schedulePath 
 * @returns {Promise<{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}>}
 */
async function loadData(groupPath, datePath, schedulePath) {
    /**
     * @type {{allGroups: string[], schedule: ScheduleEntry[][][], currentSchedule: string, seperators: Date[]}}
     */
    let dataObj = {allGroups: [], schedule: [], currentSchedule: "", seperators: []}
    await loadGroups(dataObj, groupPath)
    await loadDate(dataObj, datePath)
    await loadSchedule(dataObj, schedulePath)
    return dataObj
}