const lastWeekSeperator = new Date(2022, 10, 21)
const weekSeperator = new Date(2022, 10, 28)
/**
 * @param {Date} date 
 */
function getThisWeek9A(date) {
    if (date.getTime() - weekSeperator.getTime()>0) return nextWeek9A;
    return thisWeek9A
}

function getNextDayWeek9A(date) {
    const weekday = date.getDay()
    if (lastWeekSeperator.getTime() - date.getTime()>0) return [thisWeek9A, 1]
    if (weekday == 0 || weekday > 4) return [nextWeek9A, 1]
    return [thisWeek9A, date.getDay() + 1]
}

const thisWeek9A = [
    [

    ],
    [

    ],
    [
        
    ],
    [

    ],
    [
        new ScheduleEntry(["Mu Val"], "Val Musik", 4, 8, 0, 8, 40),
        new ScheduleEntry([], "Svenska", 4, 8, 45, 10, 5),
        new ScheduleEntry([], "Samhällskunskap", 4, 10, 10, 10, 50),
        new ScheduleEntry([], "Lunch", 4, 11, 45, 12, 5),
        new ScheduleEntry([], "Matte", 4, 12, 5, 13, 10),
        new ScheduleEntry([], "Engelska", 4, 13, 15, 14, 15),
        new ScheduleEntry(["Spets"], "Matte", 4, 14, 35, 15, 35),
    ]
]

const nextWeek9A = [
    [
        new ScheduleEntry([], "Fysik/Teknik", 0, 8, 45, 9, 25),
        new ScheduleEntry([], "Historia", 0, 9, 30, 10, 10),
        new ScheduleEntry([], "Engelska", 0, 10, 15, 11, 15),
        new ScheduleEntry([], "Lunch", 0, 11, 20, 11, 40),
        new ScheduleEntry([], "Idrott", 0, 12, 5, 12, 55),
        new ScheduleEntry(["X"], "Kemi", 0, 13, 25, 14, 25),
        new ScheduleEntry(["Y"], "Fysik/Teknik", 0, 13, 45, 14, 25),
        new ScheduleEntry(["En"], "Morderna Språk", 0, 14, 30, 15, 10),
        new ScheduleEntry(["Sp","Ty","Fr"], "Morderna Språk", 0, 14, 30, 15, 30),
        new ScheduleEntry(["Extra Spets"], "Matte 3c", 0, 15, 45, 16, 25),
    ],
    [
        new ScheduleEntry([], "Kemi", 1, 8, 0, 8, 40),
        new ScheduleEntry([], "Kemi", 1, 8, 45, 9, 25),
        new ScheduleEntry(["Sp","Ty","Fr"], "Morderna Språk", 1, 9, 40, 10, 30),
        new ScheduleEntry([], "Samhällskunskap", 1, 10, 40, 12, 0),
        new ScheduleEntry([], "Lunch", 1, 12, 20, 12, 40),
        new ScheduleEntry([], "Svenska", 1, 12, 40, 13, 25),
        new ScheduleEntry([], "Mentorstid", 1, 13, 30, 14, 10),
        new ScheduleEntry([], "Matte", 1, 14, 20, 15, 20),
    ],
    [
        new ScheduleEntry(["X"], "Hemkunskap", 2, 8, 0, 9, 10),
        new ScheduleEntry(["Y"], "Slöjd", 2, 8, 0, 9, 10),
        new ScheduleEntry(["X"], "Slöjd", 2, 9, 20, 10, 30),
        new ScheduleEntry(["Y"], "Hemkunskap", 2, 9, 20, 10, 30),
        new ScheduleEntry(["X"], "Bild", 2, 10, 40, 11, 25),
        new ScheduleEntry(["Y"], "Musik", 2, 10, 40, 11, 25),
        new ScheduleEntry([], "Historia", 2, 11, 30, 12, 10),
        new ScheduleEntry([], "Lunch", 2, 12, 10, 12, 30),
        new ScheduleEntry(["Ej Spets"], "Matte", 2, 12, 50, 13, 40),
        new ScheduleEntry(["Spets"], "Matte", 2, 12, 50, 13, 50),
        new ScheduleEntry([], "Idrott", 2, 14, 5, 15, 5),
    ],
    [
        new ScheduleEntry([], "Matte", 3, 9, 5, 10, 0),
        new ScheduleEntry([], "Morderna Språk", 3, 10, 5, 10, 45),
        new ScheduleEntry(["X"], "Musik", 3, 11, 0, 11, 45),
        new ScheduleEntry(["Y"], "Bild", 3, 11, 0, 11, 45),
        new ScheduleEntry([], "Lunch", 3, 11, 45, 12, 5),
        new ScheduleEntry([], "Svenska", 3, 12, 30, 13, 5),
        new ScheduleEntry([], "Fysik/Teknik", 3, 13, 10, 13, 50),
        new ScheduleEntry([], "Idrott", 3, 14, 10, 15, 0),
        new ScheduleEntry(["Ma Val"], "Val Matte", 3, 15, 20, 16, 0),
    ],
    [
        new ScheduleEntry(["Mu Val"], "Val Musik", 4, 8, 0, 8, 40),
        new ScheduleEntry([], "Svenska", 4, 8, 45, 10, 5),
        new ScheduleEntry([], "Samhällskunskap", 4, 10, 10, 10, 50),
        new ScheduleEntry([], "Lunch", 4, 11, 45, 12, 5),
        new ScheduleEntry([], "Matte", 4, 12, 5, 13, 10),
        new ScheduleEntry([], "Engelska", 4, 13, 15, 14, 15),
        new ScheduleEntry(["Spets"], "Matte", 4, 14, 35, 15, 35),
    ]
]

const twoWeeks9A = [
    [
        new ScheduleEntry([], "Fysik/Teknik", 0, 8, 45, 9, 25),
        new ScheduleEntry([], "Historia", 0, 9, 30, 10, 10),
        new ScheduleEntry([], "Engelska", 0, 10, 15, 11, 15),
        new ScheduleEntry([], "Lunch", 0, 11, 20, 11, 40),
        new ScheduleEntry([], "Idrott", 0, 12, 5, 12, 55),
        new ScheduleEntry(["X"], "Fysik/Teknik", 0, 13, 45, 14, 25),
        new ScheduleEntry(["Y"], "Kemi", 0, 13, 25, 14, 25),
        new ScheduleEntry(["En"], "Morderna Språk", 0, 14, 30, 15, 10),
        new ScheduleEntry(["Sp","Ty","Fr"], "Morderna Språk", 0, 14, 30, 15, 30),
        new ScheduleEntry(["Extra Spets"], "Matte 3c", 0, 15, 45, 16, 25),
    ],
    [
        new ScheduleEntry([], "Kemi", 1, 8, 0, 8, 40),
        new ScheduleEntry([], "Kemi", 1, 8, 45, 9, 25),
        new ScheduleEntry(["Sp","Ty","Fr"], "Morderna Språk", 1, 9, 40, 10, 30),
        new ScheduleEntry([], "Samhällskunskap", 1, 10, 40, 12, 0),
        new ScheduleEntry([], "Lunch", 1, 12, 20, 12, 40),
        new ScheduleEntry([], "Svenska", 1, 12, 40, 13, 25),
        new ScheduleEntry([], "Mentorstid", 1, 13, 30, 14, 10),
        new ScheduleEntry([], "Matte", 1, 14, 20, 15, 20),
    ],
    [
        new ScheduleEntry(["X"], "Hemkunskap", 2, 8, 0, 9, 10),
        new ScheduleEntry(["Y"], "Slöjd", 2, 8, 0, 9, 10),
        new ScheduleEntry(["X"], "Slöjd", 2, 9, 20, 10, 30),
        new ScheduleEntry(["Y"], "Hemkunskap", 2, 9, 20, 10, 30),
        new ScheduleEntry(["X"], "Bild", 2, 10, 40, 11, 25),
        new ScheduleEntry(["Y"], "Musik", 2, 10, 40, 11, 25),
        new ScheduleEntry([], "Historia", 2, 11, 30, 12, 10),
        new ScheduleEntry([], "Lunch", 2, 12, 10, 12, 30),
        new ScheduleEntry(["Ej Spets"], "Matte", 2, 12, 50, 13, 40),
        new ScheduleEntry(["Spets"], "Matte", 2, 12, 50, 13, 50),
        new ScheduleEntry([], "Idrott", 2, 14, 5, 15, 5),
    ],
    [
        new ScheduleEntry([], "Matte", 3, 9, 5, 10, 0),
        new ScheduleEntry([], "Morderna Språk", 3, 10, 5, 10, 45),
        new ScheduleEntry(["X"], "Musik", 3, 11, 0, 11, 45),
        new ScheduleEntry(["Y"], "Bild", 3, 11, 0, 11, 45),
        new ScheduleEntry([], "Lunch", 3, 11, 45, 12, 5),
        new ScheduleEntry([], "Svenska", 3, 12, 30, 13, 5),
        new ScheduleEntry([], "Fysik/Teknik", 3, 13, 10, 13, 50),
        new ScheduleEntry([], "Idrott", 3, 14, 10, 15, 0),
        new ScheduleEntry(["Ma Val"], "Val Matte", 3, 15, 20, 16, 0),
    ],
    [
        new ScheduleEntry(["Mu Val"], "Val Musik", 4, 8, 0, 8, 40),
        new ScheduleEntry([], "Svenska", 4, 8, 45, 10, 5),
        new ScheduleEntry([], "Samhällskunskap", 4, 10, 10, 10, 50),
        new ScheduleEntry([], "Lunch", 4, 11, 45, 12, 5),
        new ScheduleEntry([], "Matte", 4, 12, 5, 13, 10),
        new ScheduleEntry([], "Engelska", 4, 13, 15, 14, 15),
        new ScheduleEntry(["Spets"], "Matte", 4, 14, 35, 15, 35),
    ]
]