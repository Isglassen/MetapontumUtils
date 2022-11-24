/**
 * @param {Date} date 
 */
function getThisWeek9A(date) {
    const weekSeperator = new Date(2022, 11-1, 26)
    if (date.getTime() - weekSeperator.getTime()>0) return nextWeek9A;
    return thisWeek9A
}

const thisWeek9A = [
    [
        new ScheduleEntry("Fysik", 0, 8, 45, 9, 25),
        new ScheduleEntry("Historia", 0, 9, 30, 10, 10),
        new ScheduleEntry("Engelska", 0, 10, 15, 11, 15),
        new ScheduleEntry("Lunch", 0, 11, 20, 11, 40),
        new ScheduleEntry("Idrott", 0, 12, 5, 12, 55),
        new ScheduleEntry("X: Fysik, Y: Kemi", 0, 13, 25, 15, 25),
        new ScheduleEntry("Morderna Språk", 0, 14, 30, 15, 30),
        new ScheduleEntry("Matte 3c", 0, 15, 45, 16, 45),
    ],
    [
        new ScheduleEntry("KIK", 1, 8, 15, 8, 30),
        new ScheduleEntry("KIK", 1, 11, 0, 11, 30),
        new ScheduleEntry("KIK", 1, 15, 0, 15, 15),
    ],
    [

    ],
    [

    ],
    [
        new ScheduleEntry("Svenska", 4, 8, 45, 10, 5),
        new ScheduleEntry("Samhällskunskap", 4, 10, 10, 10, 50),
        new ScheduleEntry("Lunch", 4, 11, 45, 12, 5),
        new ScheduleEntry("Matte", 4, 12, 5, 13, 10),
        new ScheduleEntry("Engelska", 4, 13, 15, 14, 15),
        new ScheduleEntry("Matte Spets", 4, 14, 35, 15, 35),
    ]
]

const nextWeek9A = [

]