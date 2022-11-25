const lastWeekSeperator = new Date(2022, 10, 28)
const weekSeperator = new Date(2022, 11, 5)
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
        new ScheduleEntry(['9A'], 'Fy/Tk', 0, 8, 45, 8, 45),
        new ScheduleEntry(['9A'], 'Hi', 0, 9, 30, 9, 30),
        new ScheduleEntry(['9A'], 'En', 0, 10, 15, 10, 15),
        new ScheduleEntry(['9A'], 'Lunch', 0, 11, 20, 11, 20),
        new ScheduleEntry(['9A'], 'IdH', 0, 12, 5, 12, 5),
        new ScheduleEntry(['9A X'], 'Ke', 0, 13, 25, 13, 25),
        new ScheduleEntry(['9A Y'], 'Fy/Tk', 0, 13, 45, 13, 45),
        new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 0, 14, 30, 14, 30),
        new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 0, 14, 30, 14, 30),
        new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 0, 14, 30, 14, 30),
        new ScheduleEntry(['Mspr En'], 'En', 0, 14, 30, 14, 30),
        new ScheduleEntry(['9A S'], 'Ma3c', 0, 15, 45, 15, 45),
    ],
    [
        new ScheduleEntry(['9A'], 'Ke', 1, 8, 0, 8, 0),
        new ScheduleEntry(['9A'], 'Ke', 1, 8, 45, 8, 45),
        new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 1, 9, 40, 9, 40),
        new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 1, 9, 40, 9, 40),
        new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 1, 9, 40, 9, 40),
        new ScheduleEntry(['9A'], 'Sh', 1, 10, 40, 10, 40),
        new ScheduleEntry(['9A'], 'Lunch', 1, 12, 20, 12, 20),
        new ScheduleEntry(['9A'], 'Sv', 1, 12, 40, 12, 40),
        new ScheduleEntry(['9A'], 'Mtid', 1, 13, 30, 13, 30),
        new ScheduleEntry(['9A ej S'], 'Ma', 1, 14, 20, 14, 20),
        new ScheduleEntry(['9A S'], 'Ma', 1, 14, 20, 14, 20),
    ],
    [
        new ScheduleEntry(['9A X'], 'Hkk', 2, 8, 0, 8, 0),
        new ScheduleEntry(['9A Y'], 'Sl', 2, 8, 0, 8, 0),
        new ScheduleEntry(['9A X'], 'Sl', 2, 9, 20, 9, 20),
        new ScheduleEntry(['9A Y'], 'Hkk', 2, 9, 20, 9, 20),
        new ScheduleEntry(['9A X'], 'Bl', 2, 10, 40, 10, 40),
        new ScheduleEntry(['9A Y'], 'Mu', 2, 10, 40, 10, 40),
        new ScheduleEntry(['9A'], 'Hi', 2, 11, 30, 11, 30),
        new ScheduleEntry(['9A'], 'Lunch', 2, 12, 10, 12, 10),
        new ScheduleEntry(['9A ej S'], 'Ma', 2, 12, 50, 12, 50),
        new ScheduleEntry(['9A S'], 'Ma', 2, 12, 50, 12, 50),
        new ScheduleEntry(['9A'], 'Ma', 2, 12, 50, 12, 50),
        new ScheduleEntry(['9A'], 'IdH', 2, 14, 5, 14, 5),
    ],
    [
        new ScheduleEntry(['Mmål Rys gr 5~1'], 'Mmål Rys', 3, 8, 0, 8, 0),
        new ScheduleEntry(['9A ej S'], 'Ma', 3, 9, 5, 9, 5),
        new ScheduleEntry(['9A S'], 'Ma', 3, 9, 5, 9, 5),
        new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 3, 10, 5, 10, 5),
        new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 3, 10, 5, 10, 5),
        new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 3, 10, 5, 10, 5),
        new ScheduleEntry(['Mspr En'], 'En', 3, 10, 5, 10, 5),
        new ScheduleEntry(['9A Y'], 'Bl', 3, 11, 0, 11, 0),
        new ScheduleEntry(['9A X'], 'Mu', 3, 11, 0, 11, 0),
        new ScheduleEntry(['9A'], 'Lunch', 3, 11, 45, 11, 45),
        new ScheduleEntry(['9A'], 'Sv', 3, 12, 30, 12, 30),
        new ScheduleEntry(['9A'], 'Fy/Tk', 3, 13, 10, 13, 10),
        new ScheduleEntry(['9A'], 'IdH', 3, 14, 10, 14, 10),
        new ScheduleEntry(['9 val ma'], 'Val Ma', 3, 15, 20, 15, 20),
    ],
    [
        new ScheduleEntry(['9 val mu'], 'Val Mu', 4, 8, 0, 8, 0),
        new ScheduleEntry(['9A'], 'Sv', 4, 8, 45, 8, 45),
        new ScheduleEntry(['9A'], 'Sh', 4, 10, 10, 10, 10),
        new ScheduleEntry(['9A'], 'Lunch', 4, 11, 45, 11, 45),
        new ScheduleEntry(['9A ej S'], 'Ma', 4, 12, 5, 12, 5),
        new ScheduleEntry(['9A S'], 'Ma', 4, 12, 5, 12, 5),
        new ScheduleEntry(['9A'], 'En', 4, 13, 15, 13, 15),
        new ScheduleEntry(['9A S'], 'Ma1c/2c', 4, 14, 35, 14, 35),
    ],
]

const nextWeek9A = [
    [
        new ScheduleEntry(['9A'], 'Fy/Tk', 0, 8, 45, 8, 45),
        new ScheduleEntry(['9A'], 'Hi', 0, 9, 30, 9, 30),
        new ScheduleEntry(['9A'], 'En', 0, 10, 15, 10, 15),
        new ScheduleEntry(['9A'], 'Lunch', 0, 11, 20, 11, 20),
        new ScheduleEntry(['9A'], 'IdH', 0, 12, 5, 12, 5),
        new ScheduleEntry(['9A Y'], 'Ke', 0, 13, 25, 13, 25),
        new ScheduleEntry(['9A X'], 'Fy/Tk', 0, 13, 45, 13, 45),
        new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 0, 14, 30, 14, 30),
        new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 0, 14, 30, 14, 30),
        new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 0, 14, 30, 14, 30),
        new ScheduleEntry(['Mspr En'], 'En', 0, 14, 30, 14, 30),
        new ScheduleEntry(['9A S'], 'Ma3c', 0, 15, 45, 15, 45),
    ],
    [
        new ScheduleEntry(['9A'], 'Ke', 1, 8, 0, 8, 0),
        new ScheduleEntry(['9A'], 'Ke', 1, 8, 45, 8, 45),
        new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 1, 9, 40, 9, 40),
        new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 1, 9, 40, 9, 40),
        new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 1, 9, 40, 9, 40),
        new ScheduleEntry(['9A'], 'Sh', 1, 10, 40, 10, 40),
        new ScheduleEntry(['9A'], 'Lunch', 1, 12, 20, 12, 20),
        new ScheduleEntry(['9A'], 'Sv', 1, 12, 40, 12, 40),
        new ScheduleEntry(['9A'], 'Mtid', 1, 13, 30, 13, 30),
        new ScheduleEntry(['9A ej S'], 'Ma', 1, 14, 20, 14, 20),
        new ScheduleEntry(['9A S'], 'Ma', 1, 14, 20, 14, 20),
    ],
    [
        new ScheduleEntry(['9A X'], 'Hkk', 2, 8, 0, 8, 0),
        new ScheduleEntry(['9A Y'], 'Sl', 2, 8, 0, 8, 0),
        new ScheduleEntry(['9A X'], 'Sl', 2, 9, 20, 9, 20),
        new ScheduleEntry(['9A Y'], 'Hkk', 2, 9, 20, 9, 20),
        new ScheduleEntry(['9A X'], 'Bl', 2, 10, 40, 10, 40),
        new ScheduleEntry(['9A Y'], 'Mu', 2, 10, 40, 10, 40),
        new ScheduleEntry(['9A'], 'Hi', 2, 11, 30, 11, 30),
        new ScheduleEntry(['9A'], 'Lunch', 2, 12, 10, 12, 10),
        new ScheduleEntry(['9A ej S'], 'Ma', 2, 12, 50, 12, 50),
        new ScheduleEntry(['9A S'], 'Ma', 2, 12, 50, 12, 50),
        new ScheduleEntry(['9A'], 'Ma', 2, 12, 50, 12, 50),
        new ScheduleEntry(['9A'], 'IdH', 2, 14, 5, 14, 5),
    ],
    [
        new ScheduleEntry(['Mmål Rys gr 5~1'], 'Mmål Rys', 3, 8, 0, 8, 0),
        new ScheduleEntry(['9A ej S'], 'Ma', 3, 9, 5, 9, 5),
        new ScheduleEntry(['9A S'], 'Ma', 3, 9, 5, 9, 5),
        new ScheduleEntry(['Mspr Ty 9'], 'Mspr Ty', 3, 10, 5, 10, 5),
        new ScheduleEntry(['Mspr Spa 9'], 'Mspr Sp', 3, 10, 5, 10, 5),
        new ScheduleEntry(['Mspr Fra 9'], 'Mspr Fr', 3, 10, 5, 10, 5),
        new ScheduleEntry(['Mspr En'], 'En', 3, 10, 5, 10, 5),
        new ScheduleEntry(['9A Y'], 'Bl', 3, 11, 0, 11, 0),
        new ScheduleEntry(['9A X'], 'Mu', 3, 11, 0, 11, 0),
        new ScheduleEntry(['9A'], 'Lunch', 3, 11, 45, 11, 45),
        new ScheduleEntry(['9A'], 'Sv', 3, 12, 30, 12, 30),
        new ScheduleEntry(['9A'], 'Fy/Tk', 3, 13, 10, 13, 10),
        new ScheduleEntry(['9A'], 'IdH', 3, 14, 10, 14, 10),
        new ScheduleEntry(['9 val ma'], 'Val Ma', 3, 15, 20, 15, 20),
    ],
    [
        new ScheduleEntry(['9 val mu'], 'Val Mu', 4, 8, 0, 8, 0),
        new ScheduleEntry(['9A'], 'Sv', 4, 8, 45, 8, 45),
        new ScheduleEntry(['9A'], 'Sh', 4, 10, 10, 10, 10),
        new ScheduleEntry(['9A'], 'Lunch', 4, 11, 45, 11, 45),
        new ScheduleEntry(['9A ej S'], 'Ma', 4, 12, 5, 12, 5),
        new ScheduleEntry(['9A S'], 'Ma', 4, 12, 5, 12, 5),
        new ScheduleEntry(['9A'], 'En', 4, 13, 15, 13, 15),
        new ScheduleEntry(['9A S'], 'Ma1c/2c', 4, 14, 35, 14, 35),
    ],
]