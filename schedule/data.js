const lastWeekSeperator = new Date(2022, 11, 12)
const weekSeperator = new Date(2022, 11, 19)

function getThisWeek(date, schedule) {
    // TODO: Add a case for if it's past the next week
    // If the date's time is past the weekSeperator, return the next week
    if (date.getTime() - weekSeperator.getTime()>0) return schedules[schedule].nextWeek;
    // Otherwise return the current week
    return schedules[schedule].thisWeek
}

function getNextDayWeek(date, schedule) {
    // Initialise variables for the start of counting
    let week = ""
    let weekday = 0

    // If it's before this week, the next day is monday this week
    if (lastWeekSeperator.getTime() - date.getTime()>0) {
        week = "thisWeek"
        weekday = 1
    }
    // If it's the next week
    else if (weekSeperator.getTime() - date.getTime()<0) {
        // TODO: Add a case for if it's past the next week
        // If it's a weekend, we have no next day
        if (date.getDay() == 0 || date.getDay() > 4) {
            console.log("No day")
            return ["",0,[]]
        }
        // Otherwise simply start at the next day
        week = "nextWeek"
        weekday = date.getDay() + 1
    }
    // If it's the current week, but the weekend, set the next week
    else if (date.getDay() == 0 || date.getDay() > 4) {
        week = "nextWeek"
        weekday = 1
    }
    // Otherwise simply use next day
    else {
        week = "thisWeek"
        weekday = date.getDay() + 1
    }

    // Loop through every day from the previously set day until we find one with lessons
    while (schedules[schedule][week][weekday-1].length === 0) {
        weekday++
        // If the next day is a weekend this week, start on next week
        if (weekday>5 && week === "thisWeek") {
            weekday = 1
            week = "nextWeek"
        }
        // If the next day is a weekend next week, we don't have any lessons to display
        if (weekday>5 && week === "nextWeek") {
            console.log("Nothing in day")
            return ["",0,[]]
        }
    }

    // Return week, weekday, schedule
    return [week, weekday, schedules[schedule][week][weekday-1]]
}

const schedules = {
    "9A": {
        "thisWeek": [
            [
                new ScheduleEntry(['9A'], 'Fy', 0, 8, 45, 9, 25),
                new ScheduleEntry(['9A'], 'Hi', 0, 9, 30, 10, 10),
                new ScheduleEntry(['9A'], 'En', 0, 10, 15, 11, 15),
                new ScheduleEntry(['9A'], 'Lunch', 0, 11, 20, 11, 40),
                new ScheduleEntry(['9A'], 'IdH', 0, 12, 5, 12, 55),
                new ScheduleEntry(['9A X'], 'Ke', 0, 13, 25, 14, 25),
                new ScheduleEntry(['9A Y'], 'Fy/Tk', 0, 13, 45, 14, 25),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr En'], 'En', 0, 14, 30, 15, 10),
                new ScheduleEntry(['9A S'], 'Ma3c', 0, 15, 45, 16, 45),
            ],
            [
                new ScheduleEntry(['9A'], 'Ke', 1, 8, 0, 8, 40),
                new ScheduleEntry(['9A'], 'Ke', 1, 8, 45, 9, 25),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 1, 9, 40, 10, 30),
                new ScheduleEntry(['9A'], 'Sh', 1, 10, 40, 12, 0),
                new ScheduleEntry(['9A'], 'Lunch', 1, 12, 20, 12, 40),
                new ScheduleEntry(['9A'], 'Sv', 1, 12, 40, 13, 25),
                new ScheduleEntry(['9A'], 'Mtid', 1, 13, 30, 14, 10),
                new ScheduleEntry(['9A ej S'], 'Ma', 1, 14, 20, 15, 20),
                new ScheduleEntry(['9A S'], 'Ma', 1, 14, 20, 15, 20),
            ],
            [
                new ScheduleEntry(['9A X'], 'Hkk', 2, 8, 0, 9, 10),
                new ScheduleEntry(['9A Y'], 'Sl', 2, 8, 0, 9, 10),
                new ScheduleEntry(['9A X'], 'Sl', 2, 9, 20, 10, 30),
                new ScheduleEntry(['9A Y'], 'Hkk', 2, 9, 20, 10, 30),
                new ScheduleEntry(['9A X'], 'Bl', 2, 10, 40, 11, 25),
                new ScheduleEntry(['9A Y'], 'Mu', 2, 10, 40, 11, 25),
                new ScheduleEntry(['9A'], 'Hi', 2, 11, 30, 12, 10),
                new ScheduleEntry(['9A'], 'Lunch', 2, 12, 10, 12, 30),
                new ScheduleEntry(['9A ej S'], 'Ma', 2, 12, 50, 13, 40),
                new ScheduleEntry(['9A S'], 'Ma', 2, 12, 50, 13, 50),
                new ScheduleEntry(['9A'], 'Ma', 2, 12, 50, 13, 40),
                new ScheduleEntry(['9A'], 'IdH', 2, 14, 5, 15, 5),
            ],
            [
                new ScheduleEntry(['Mmål Rys gr 5~1'], 'Mmål Rys', 3, 8, 0, 9, 0),
                new ScheduleEntry(['9A ej S'], 'Ma', 3, 9, 5, 10, 0),
                new ScheduleEntry(['9A S'], 'Ma', 3, 9, 5, 10, 0),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr En'], 'En', 3, 10, 5, 10, 45),
                new ScheduleEntry(['9A Y'], 'Bl', 3, 11, 0, 11, 45),
                new ScheduleEntry(['9A X'], 'Mu', 3, 11, 0, 11, 45),
                new ScheduleEntry(['9A'], 'Lunch', 3, 11, 45, 12, 5),
                new ScheduleEntry(['9A'], 'Sv', 3, 12, 30, 13, 5),
                new ScheduleEntry(['9A'], 'Fy', 3, 13, 10, 13, 50),
                new ScheduleEntry(['9A'], 'IdH', 3, 14, 10, 15, 0),
                new ScheduleEntry(['9 val ma'], 'Val Ma', 3, 15, 20, 16, 0),
            ],
            [
                new ScheduleEntry(['9 val mu'], 'Val Mu', 4, 8, 0, 8, 40),
                new ScheduleEntry(['9A'], 'Sv', 4, 8, 45, 10, 5),
                new ScheduleEntry(['9A'], 'Sh', 4, 10, 10, 10, 50),
                new ScheduleEntry(['9A'], 'Lunch', 4, 11, 45, 12, 5),
                new ScheduleEntry(['9A ej S'], 'Ma', 4, 12, 5, 13, 10),
                new ScheduleEntry(['9A S'], 'Ma', 4, 12, 5, 13, 10),
                new ScheduleEntry(['9A'], 'En', 4, 13, 15, 14, 15),
                new ScheduleEntry(['9A S'], 'Ma1c/2c', 4, 14, 35, 15, 35),
            ],
        ],
        "nextWeek": [
            [
                new ScheduleEntry(['9A'], 'Fy', 0, 8, 45, 9, 25),
                new ScheduleEntry(['9A'], 'Hi', 0, 9, 30, 10, 10),
                new ScheduleEntry(['9A'], 'En', 0, 10, 15, 11, 15),
                new ScheduleEntry(['9A'], 'Lunch', 0, 11, 20, 11, 40),
                new ScheduleEntry(['9A'], 'IdH', 0, 12, 5, 12, 55),
                new ScheduleEntry(['9A Y'], 'Ke', 0, 13, 25, 14, 25),
                new ScheduleEntry(['9A X'], 'Fy/Tk', 0, 13, 45, 14, 25),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr En'], 'En', 0, 14, 30, 15, 10),
                new ScheduleEntry(['9A S'], 'Ma3c', 0, 15, 45, 16, 45),
            ],
            [
                new ScheduleEntry(['9A'], 'Ke', 1, 8, 0, 8, 40),
                new ScheduleEntry(['9A'], 'Ke', 1, 8, 45, 9, 25),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 1, 9, 40, 10, 30),
                new ScheduleEntry(['9A'], 'Sh', 1, 10, 40, 12, 0),
                new ScheduleEntry(['9A'], 'Lunch', 1, 12, 20, 12, 40),
                new ScheduleEntry(['9A'], 'Sv', 1, 12, 40, 13, 25),
                new ScheduleEntry(['9A'], 'Mtid', 1, 13, 30, 14, 10),
                new ScheduleEntry(['9A ej S'], 'Ma', 1, 14, 20, 15, 20),
                new ScheduleEntry(['9A S'], 'Ma', 1, 14, 20, 15, 20),
            ],
            [
                new ScheduleEntry(['9A X'], 'Hkk', 2, 8, 0, 9, 10),
                new ScheduleEntry(['9A Y'], 'Sl', 2, 8, 0, 9, 10),
                new ScheduleEntry(['9A X'], 'Sl', 2, 9, 20, 10, 30),
                new ScheduleEntry(['9A Y'], 'Hkk', 2, 9, 20, 10, 30),
                new ScheduleEntry(['9A X'], 'Bl', 2, 10, 40, 11, 25),
                new ScheduleEntry(['9A Y'], 'Mu', 2, 10, 40, 11, 25),
                new ScheduleEntry(['9A'], 'Hi', 2, 11, 30, 12, 10),
                new ScheduleEntry(['9A'], 'Lunch', 2, 12, 10, 12, 30),
                new ScheduleEntry(['9A ej S'], 'Ma', 2, 12, 50, 13, 40),
                new ScheduleEntry(['9A S'], 'Ma', 2, 12, 50, 13, 50),
                new ScheduleEntry(['9A'], 'Ma', 2, 12, 50, 13, 40),
                new ScheduleEntry(['9A'], 'IdH', 2, 14, 5, 15, 5),
            ],
            [
                new ScheduleEntry(['Mmål Rys gr 5~1'], 'Mmål Rys', 3, 8, 0, 9, 0),
                new ScheduleEntry(['9A ej S'], 'Ma', 3, 9, 5, 10, 0),
                new ScheduleEntry(['9A S'], 'Ma', 3, 9, 5, 10, 0),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr En'], 'En', 3, 10, 5, 10, 45),
                new ScheduleEntry(['9A Y'], 'Bl', 3, 11, 0, 11, 45),
                new ScheduleEntry(['9A X'], 'Mu', 3, 11, 0, 11, 45),
                new ScheduleEntry(['9A'], 'Lunch', 3, 11, 45, 12, 5),
                new ScheduleEntry(['9A'], 'Sv', 3, 12, 30, 13, 5),
                new ScheduleEntry(['9A'], 'Fy', 3, 13, 10, 13, 50),
                new ScheduleEntry(['9A'], 'IdH', 3, 14, 10, 15, 0),
                new ScheduleEntry(['9 val ma'], 'Val Ma', 3, 15, 20, 16, 0),
            ],
            [
            ],
        ],
    },
    "9B": {
        "thisWeek": [
            [
                new ScheduleEntry(['9B'], 'IdH', 0, 9, 0, 10, 0),
                new ScheduleEntry(['9B'], 'Ke', 0, 10, 45, 11, 25),
                new ScheduleEntry(['9B'], 'Lunch', 0, 11, 45, 12, 5),
                new ScheduleEntry(['9B'], 'Ma', 0, 12, 5, 12, 55),
                new ScheduleEntry(['9B'], 'Ma', 0, 12, 5, 12, 55),
                new ScheduleEntry(['9B'], 'Sv', 0, 13, 0, 14, 20),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Stöd.SA'], 'Stöd', 0, 14, 30, 15, 30),
            ],
            [
                new ScheduleEntry(['9B'], 'Tk', 1, 8, 45, 9, 25),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Stöd.SA'], 'Stöd', 1, 9, 40, 10, 30),
                new ScheduleEntry(['9B'], 'Ma', 1, 10, 35, 11, 55),
                new ScheduleEntry(['9B'], 'Lunch', 1, 12, 20, 12, 40),
                new ScheduleEntry(['9B'], 'Sv', 1, 12, 40, 13, 25),
                new ScheduleEntry(['9B Y'], 'Bl', 1, 13, 45, 14, 30),
                new ScheduleEntry(['9B X'], 'Mu', 1, 13, 45, 14, 30),
                new ScheduleEntry(['9B Y'], 'Mu', 1, 14, 35, 15, 20),
                new ScheduleEntry(['9B X'], 'Bl', 1, 14, 35, 15, 20),
                new ScheduleEntry(['Mmål Pol gr 1~1'], 'Mmål Pol', 1, 15, 20, 16, 20),
            ],
            [
                new ScheduleEntry(['9B'], 'Ma', 2, 8, 25, 9, 5),
                new ScheduleEntry(['9B'], 'Hi', 2, 9, 15, 10, 0),
                new ScheduleEntry(['9B'], 'Ke', 2, 10, 5, 10, 45),
                new ScheduleEntry(['9B'], 'Tk', 2, 10, 50, 11, 30),
                new ScheduleEntry(['9B'], 'Lunch', 2, 12, 0, 12, 20),
                new ScheduleEntry(['9B Y'], 'Sl', 2, 12, 20, 13, 30),
                new ScheduleEntry(['9B X'], 'Hkk', 2, 12, 20, 13, 30),
                new ScheduleEntry(['9B Y'], 'Hkk', 2, 13, 45, 14, 55),
                new ScheduleEntry(['9B X'], 'Sl', 2, 13, 45, 14, 55),
                new ScheduleEntry(['9B'], 'IdH', 2, 15, 10, 16, 0),
                new ScheduleEntry(['Mmål Ara gr 3'], 'Mmål Ara', 2, 15, 30, 16, 30),
            ],
            [
                new ScheduleEntry(['Extra idrott'], 'IdH', 3, 8, 0, 9, 0),
                new ScheduleEntry(['Mmål Rys gr 5~1'], 'Mmål Rys', 3, 8, 0, 9, 0),
                new ScheduleEntry(['9B X'], 'Ke', 3, 9, 0, 10, 0),
                new ScheduleEntry(['9B Y'], 'Fy/Tk', 3, 9, 20, 10, 0),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Stöd.SA'], 'Stöd', 3, 10, 5, 10, 45),
                new ScheduleEntry(['9B'], 'IdH', 3, 11, 0, 11, 50),
                new ScheduleEntry(['9B'], 'Lunch', 3, 12, 10, 12, 30),
                new ScheduleEntry(['9B'], 'Sv', 3, 12, 30, 13, 5),
                new ScheduleEntry(['9B'], 'Sh', 3, 13, 15, 14, 20),
                new ScheduleEntry(['9B'], 'Sh', 3, 14, 25, 15, 15),
                new ScheduleEntry(['9 val ma'], 'Val Ma', 3, 15, 20, 16, 0),
            ],
            [
                new ScheduleEntry(['9 val mu'], 'Val Mu', 4, 8, 0, 8, 40),
                new ScheduleEntry(['9B'], 'En', 4, 8, 45, 9, 55),
                new ScheduleEntry(['9B'], 'Ma', 4, 10, 0, 11, 0),
                new ScheduleEntry(['9B'], 'Lunch', 4, 11, 55, 12, 15),
                new ScheduleEntry(['9B'], 'En', 4, 12, 15, 13, 5),
                new ScheduleEntry(['9B'], 'Mtid', 4, 13, 15, 13, 55),
                new ScheduleEntry(['9B'], 'Hi', 4, 14, 10, 14, 50),
                new ScheduleEntry(['Mmål Man gr 2~1'], 'Mmål Man', 4, 15, 0, 16, 0),
            ],
        ],
        "nextWeek": [
            [
                new ScheduleEntry(['9B'], 'IdH', 0, 9, 0, 10, 0),
                new ScheduleEntry(['9B'], 'Ke', 0, 10, 45, 11, 25),
                new ScheduleEntry(['9B'], 'Lunch', 0, 11, 45, 12, 5),
                new ScheduleEntry(['9B'], 'Ma', 0, 12, 5, 12, 55),
                new ScheduleEntry(['9B'], 'Ma', 0, 12, 5, 12, 55),
                new ScheduleEntry(['9B'], 'Sv', 0, 13, 0, 14, 20),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 0, 14, 30, 15, 30),
                new ScheduleEntry(['Stöd.SA'], 'Stöd', 0, 14, 30, 15, 30),
            ],
            [
                new ScheduleEntry(['9B'], 'Tk', 1, 8, 45, 9, 25),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 1, 9, 40, 10, 30),
                new ScheduleEntry(['Stöd.SA'], 'Stöd', 1, 9, 40, 10, 30),
                new ScheduleEntry(['9B'], 'Ma', 1, 10, 35, 11, 55),
                new ScheduleEntry(['9B'], 'Lunch', 1, 12, 20, 12, 40),
                new ScheduleEntry(['9B'], 'Sv', 1, 12, 40, 13, 25),
                new ScheduleEntry(['9B Y'], 'Bl', 1, 13, 45, 14, 30),
                new ScheduleEntry(['9B X'], 'Mu', 1, 13, 45, 14, 30),
                new ScheduleEntry(['9B Y'], 'Mu', 1, 14, 35, 15, 20),
                new ScheduleEntry(['9B X'], 'Bl', 1, 14, 35, 15, 20),
                new ScheduleEntry(['Mmål Pol gr 1~1'], 'Mmål Pol', 1, 15, 20, 16, 20),
            ],
            [
                new ScheduleEntry(['9B'], 'Ma', 2, 8, 25, 9, 5),
                new ScheduleEntry(['9B'], 'Hi', 2, 9, 15, 10, 0),
                new ScheduleEntry(['9B'], 'Ke', 2, 10, 5, 10, 45),
                new ScheduleEntry(['9B'], 'Tk', 2, 10, 50, 11, 30),
                new ScheduleEntry(['9B'], 'Lunch', 2, 12, 0, 12, 20),
                new ScheduleEntry(['9B Y'], 'Sl', 2, 12, 20, 13, 30),
                new ScheduleEntry(['9B X'], 'Hkk', 2, 12, 20, 13, 30),
                new ScheduleEntry(['9B Y'], 'Hkk', 2, 13, 45, 14, 55),
                new ScheduleEntry(['9B X'], 'Sl', 2, 13, 45, 14, 55),
                new ScheduleEntry(['9B'], 'IdH', 2, 15, 10, 16, 0),
                new ScheduleEntry(['Mmål Ara gr 3'], 'Mmål Ara', 2, 15, 30, 16, 30),
            ],
            [
                new ScheduleEntry(['Extra idrott'], 'IdH', 3, 8, 0, 9, 0),
                new ScheduleEntry(['Mmål Rys gr 5~1'], 'Mmål Rys', 3, 8, 0, 9, 0),
                new ScheduleEntry(['9B Y'], 'Ke', 3, 9, 0, 10, 0),
                new ScheduleEntry(['9B X'], 'Fy/Tk', 3, 9, 20, 10, 0),
                new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 3, 10, 5, 10, 45),
                new ScheduleEntry(['Stöd.SA'], 'Stöd', 3, 10, 5, 10, 45),
                new ScheduleEntry(['9B'], 'IdH', 3, 11, 0, 11, 50),
                new ScheduleEntry(['9B'], 'Lunch', 3, 12, 10, 12, 30),
                new ScheduleEntry(['9B'], 'Sv', 3, 12, 30, 13, 5),
                new ScheduleEntry(['9B'], 'Sh', 3, 13, 15, 14, 20),
                new ScheduleEntry(['9B'], 'Sh', 3, 14, 25, 15, 15),
                new ScheduleEntry(['9 val ma'], 'Val Ma', 3, 15, 20, 16, 0),
            ],
            [
            ],
        ],
    }
}