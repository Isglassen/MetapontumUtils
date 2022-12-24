from bs4 import BeautifulSoup
from pathlib import Path
from jsonUtil import NoIndent, MyEncoder
import json

readPath = Path(__file__).parent / "htmlData.html"
jsonPath = Path(__file__).parent / "scheduleJSON.json"

with readPath.open("r") as f:
    soup = BeautifulSoup(f, features="html.parser").tbody

widths = [];
_first_row = True
for child in soup.tr.children:
    if _first_row: _first_row = False; continue

    widths.append(int(child["colspan"]))

rowSpans = []
lessons: list[list[dict[str, str]]] = []

for width in widths:
    obj = []
    for _ in range(width):
        obj.append(0)
    rowSpans.append(obj)
    lessons.append([])

# print(rowSpans)

row = 0
for tr in soup.children:
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
                for width in col:
                    # print("SubCol "+str(subCol)+": "+str(i))
                    if width == row:
                        # print("Chose weekday "+str(weekday)+" subCol "+str(subCol))
                        end = True
                        break
                    subCol += 1
                if end: break
                weekday += 1
            
            # Add our new rows
            for width in range(colspan):
                rowSpans[weekday][subCol+width] += rowspan
                # print(str(weekday)+":"+str(subCol+i)+" : "+str(rowSpans[weekday][subCol+i]))

            # Ignore empty space and weekday lables
            if top: continue
            if "light" in td["class"]: continue

            style = ""
            try:
                style = td["style"]

            except:
                # print("Object has no style")
                pass

            lessons[weekday].append({"info": td.div["title"], "style": style})
        row += 1

    # Skip possible newlines (because those exist...)
    except Exception as err:
        if str(err) != "'NavigableString' object has no attribute 'children'": raise(err)

# Parse lesson data into our format
output = []
weekday = 0
for day in lessons:
    dayData = []
    for lesson in day:
        outObj = []
        info = lesson["info"]
        header = info[info.index("header=[ ")+9:info.index(" body")-1]
        body = info[info.index("body=[")+6:info.rindex("]")]
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
        style = lesson["style"]
        if style == "":
            style = "background-color:#ffffff; color:#000000"
        outObj.append(style) # Colors for the lesson
        dayData.append(NoIndent(outObj))
    output.append(dayData)
    weekday += 1

# Convert this to a string for output into js (unused)
indent = "    "
outStr = "[\n"
for day in output:
    outStr += indent+"[\n"
    for lesson in day:
        lesson = lesson.value
        outStr += 2*indent+"new ScheduleEntry(["+repr(lesson[0])+"], "+repr(lesson[1])+", "+repr(lesson[2])+", "+repr(lesson[3])+", "+repr(lesson[4])+", "+repr(lesson[5])+", "+repr(lesson[6])+", "+repr(lesson[7])+"),\n"
    outStr += indent+"],\n"
outStr += "],"

# Save json
with jsonPath.open("w") as f:
    f.write(json.dumps(output, cls=MyEncoder, indent=4))

print("Remember to rename the groups and lessons so that they are more readable")