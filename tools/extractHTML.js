// @ts-nocheck

// run this in schoolsoft website console and copy the output to htmlData.html
// then run getScheduleData.py. You will get output in scheduleJSON.json
// NEVER commit while htmlData.html has data in it since it might leak information (I haven't checked)
// NOTE: Titles will only be available after reloading the page and instantly pasting the command
const scheduleTable = document.getElementById("schedule_cont_content").getElementsByTagName("table")[0].innerHTML
"<html><head></head><body>"+scheduleTable+"</body></html>"