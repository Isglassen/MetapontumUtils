from bs4 import BeautifulSoup
from pathlib import Path
import json

readPath = Path(__file__).parent / "htmlData.html"
jsonPath = Path(__file__).parent / "scheduleJSON.json"
writePath = Path(__file__).parent / "outSource.js"

with readPath.open("r") as f:
    soup = BeautifulSoup(f, features="html.parser").tbody

widths = [];
_first_row = True
for child in soup.tr.children:
    if _first_row: _first_row = False; continue

    widths.append(int(child["colspan"]))

rowSpans = []
lessons: list[list[str]] = []

for i in widths:
    obj = []
    for i2 in range(i):
        obj.append(0)
    rowSpans.append(obj)
    lessons.append([])

# print(rowSpans)

row = 0
for tr in soup.children:
    #Skip possible newlines (because those exist...)
    try:
        for td in tr.children:

            #If there is no colspan it's a time lable
            try: colspan = int(td["colspan"])
            except: continue

            #If there is no rowspan it's a weekday lable (We will stil include the rows)
            top = False
            try: rowspan = int(td["rowspan"])
            except: rowspan = 1; top = True

            weekday = 0
            subCol = 0

            #Loop through our list of filled space to see what day this lesson should be
            end = False
            for col in rowSpans:
                # print("Checking weekday "+str(weekday))
                # print("Needs "+str(row))
                subCol = 0
                for i in col:
                    # print("SubCol "+str(subCol)+": "+str(i))
                    if i == row:
                        # print("Chose weekday "+str(weekday)+" subCol "+str(subCol))
                        end = True
                        break
                    subCol += 1
                if end: break
                weekday += 1
            
            # Add our new rows
            for i in range(colspan):
                rowSpans[weekday][subCol+i] += rowspan
                # print(str(weekday)+":"+str(subCol+i)+" : "+str(rowSpans[weekday][subCol+i]))

            # Ignore empty space and weekday lables
            if top: continue
            if "light" in td["class"]: continue

            lessons[weekday].append(td.div["title"])
        row += 1

    except Exception as err:
        if str(err) != "'NavigableString' object has no attribute 'children'": raise(err)

# Parse lesson data into our format
output = []
weekday = 0
for day in lessons:
    dayData = []
    for lesson in day:
        outObj = []
        header = lesson[lesson.index("header=[ ")+9:lesson.index(" body")-1]
        body = lesson[lesson.index("body=[")+6:lesson.rindex("]")]
        group = body[body.index("Grupp: ")+7:body.index("\\n", body.index("Grupp: ")+7)]
        name = header[header.index(" ")+1:]
        times = header[:header.index(" ")].split("-")
        startTimes = times[0].split(":")
        endTimes = times[1].split(":")
        outObj.append(group) # Group for this lesson (will be replaced by user)
        outObj.append(name) # Name for this lesson (will be replaced by user)
        outObj.append(weekday) # Weekday of this lesson
        outObj.append(int(startTimes[0])) # Start time hours
        outObj.append(int(startTimes[1])) # Start time minutes
        outObj.append(int(endTimes[0])) # End time hours 
        outObj.append(int(endTimes[1])) # End time minutes
        dayData.append(outObj)
    output.append(dayData)
    weekday += 1

# Convert this to a string for output
indent = "    "
outStr = "[\n"
for day in output:
    outStr += indent+"[\n"
    for lesson in day:
        outStr += 2*indent+"new ScheduleEntry(["+repr(lesson[0])+"], "+repr(lesson[1])+", "+repr(lesson[2])+", "+repr(lesson[3])+", "+repr(lesson[4])+", "+repr(lesson[5])+", "+repr(lesson[6])+"),\n"
    outStr += indent+"],\n"
outStr += "]"

with jsonPath.open("w") as f:
    f.write(json.dumps(output, indent=2))

with writePath.open("w") as f:
    f.write(outStr)

print("Remember to rename the groups and lessons so that they are more readable")