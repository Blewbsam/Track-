import {
  getConsecutiveDates,
  getEndTime,
  capFirst,
  timeToNumber,
  isAFloat,
  floorTime,
  minuteStyle,
  standarDateString,
  standardTimeString,
  getPriorDisplayDate,
  getTodayDisplayDate,
  getDayIndexFromEpoch,
} from "../helpers.js";
import { ACTIVITIES, CELLHEIGHT } from "../config.js";

class scheduleView {
  _parentElement = document.querySelector(".schedule-table");
  // top bar related
  weekBar = document.getElementById("week-bar");
  weekBarH1 = document.querySelector(".current-week");
  leftClickBtn = document.querySelector(".left-click");
  rightClickBtn = document.querySelector(".right-click");

  daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  _hours = [
    "7:00",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "24:00",
    "1:00",
    "2:00",
    "3:00",
  ];

  initialize(day, seconds) {
    // initalizes schedule by adding time table and inserting columns
    //NOTE: order of these functions is of extreme importance and changing them will change codes functioning.

    const curDate = new Date();
    this.curEpochSeconds = curDate.getTime() / 1000;

    this._insertTimeEntries();
    this.insertAllColumns(day, seconds);
    this._insertDatetime(day, seconds);
  }

  updateEntries(all_entries) {
    console.log("Updating entries");
    this.allEntries = all_entries;
  }

  createEmptyDay(day, date) {
    //creates an entire empty column with proper day name at the top
    if (!this.daysOfWeek.includes(day))
      throw new Error(`Proper day not given: ${day}`);
    const head = `<section id="schedule-${date}" class="day-schedule">
    <div class="day-name top-info">${
      day.charAt(0).toUpperCase() + day.slice(1)
    }</div>`;
    const cells = this.createEmptyColumn(date);
    const bottom = `</section>`;

    return head + cells + bottom;
  }

  createEmptyColumn(date) {
    //Creates a 19 consecutive divs of cells and returns it
    const standardizedDateString = standarDateString(date);

    let html = String();
    for (let i = 0; i < 21; i++) {
      let standardizedTimeString = standardTimeString(this._hours[i]);
      let text = `<div class="hour-cell" id="${standardizedDateString}@${standardizedTimeString}"></div>`;
      html = html.concat(text);
    }
    return html;
  }

  _insertColumnOfCells(day) {
    //inserts proprer html of day produced from createEmptyDay to proper column
    const html = this.createEmptyDay(day);
    this._parentElement.insertAdjacentHTML("beforeend", html);
  }

  _insertTimeEntries() {
    // displays time on the left of schedule.
    const timeTableDiv = document.getElementById("time-table");
    if (!timeTableDiv) throw new Error("Time table wasn't found.");

    let html = `<section class="times">
    <div class="hours"></div>
    <div class="hours"> </div>`;
    let divHTML;
    for (let i = 0; i < this._hours.length; i++) {
      divHTML = `<div class="hours"><p class="times-left-column-text">${this._hours[i]}</p></div>`;
      html = html.concat(divHTML);
    }
    let finalHTML = html.concat("</section>");

    timeTableDiv.insertAdjacentHTML("afterbegin", finalHTML);
  }
  _insertDatetime(day, seconds) {
    // Get todays date and seven days ago's data and display them surrounded by two buttons allowing to go back and forward

    //get dates and display them,

    this._insertDateSpan(this.curEpochSeconds);

    // add Eventlisteners to buttons:
    if (!this.leftClickBtn || !this.rightClickBtn)
      throw new Error("Btns missing");
    this.leftClickBtn.addEventListener(
      "click",
      this.displayPreviousWeek.bind(this)
    );
    this.rightClickBtn.addEventListener(
      "click",
      this.displayNextWeek.bind(this)
    );
  }

  displayPreviousWeek() {
    // displays all days and activities fro previous seven days onto schedule

    // displays new date span on top right of table
    this.curEpochSeconds = this.curEpochSeconds - 7 * 24 * 60 * 60;
    this._insertDateSpan();

    // Clear old schedule and insert new columns with proper classes to have elements displayed on them
    this.clearSchedule();
    this.insertAllColumns();
    this.insertAllActivities();
  }

  displayNextWeek() {
    // displays all days and activities from given date to following seven days
    this.curEpochSeconds = this.curEpochSeconds + 7 * 24 * 60 * 60;
    this._insertDateSpan();

    // Clear old schedule and insert new columns with proper classes to have elements displayed on them
    this.clearSchedule();
    this.insertAllColumns();
    this.insertAllActivities();
  }

  _insertDateSpan() {
    // display the start and end date of days on the table with format ----/--/-- - ----/--/--
    if (!this.curEpochSeconds)
      throw new Error("this.curEpochSeconds has not been defined");

    var curDisplayDate = getTodayDisplayDate(this.curEpochSeconds);
    var priorDisplayDate = getPriorDisplayDate(this.curEpochSeconds);
    const displayText = priorDisplayDate.concat("-", curDisplayDate);
    if (!this.weekBarH1)
      throw new Error("h1 element with class current-week not found.");
    this.weekBarH1.innerHTML = displayText;
  }

  clearSchedule() {
    // removes everthing within the schdule box
    this._parentElement.innerHTML = "";
  }

  insertAllColumns() {
    // gets week-name of day and date in seconds
    const todayDay =
      this.daysOfWeek[getDayIndexFromEpoch(this.curEpochSeconds)];
    console.log("Today day is: ", todayDay);
    console.log("Today seconds is", this.curEpochSeconds);
    if (!this.daysOfWeek.includes(todayDay))
      throw new Error("proper day not given");
    const dayIndex = this.daysOfWeek.findIndex((x) => x === todayDay);
    let displayDay = (dayIndex + 1) % 7;
    let html = ``;
    let consectuiveDates = getConsecutiveDates(this.curEpochSeconds); // returns 6 previous days and today in "year-month-day"
    // create the columns with proper id's
    for (let i = 0; i < 7; i++) {
      html = html.concat(
        this.createEmptyDay(this.daysOfWeek[displayDay], consectuiveDates[i])
      );
      displayDay = (displayDay + 1) % 7;
    }
    this._parentElement.insertAdjacentHTML("afterbegin", html);
  }

  insertAllActivities() {
    //Inserts all activities given to it in the relavent time slots
    const activities = this.allEntries; // localized for simplicity.

    activities.forEach((activity) => {
      let [flooredHours, minutes] = floorTime(activity.time); //all cell id's are by the hour so everygiven time needs to be scaled down.
      let id = `${activity.date}@${flooredHours}`;

      let actId = `${activity.date}@${activity.time}`;
      let slot = document.getElementById(id);
      if (!slot) {
        return;
      }
      this.UpdateSlot(
        slot,
        activity.activity,
        activity.duration,
        id,
        minutes,
        actId
      );
    });
  }

  UpdateSlot(slot, type, duration, id, minutes, actId) {
    //insert new box into given slot with correct information and color
    // id must have format day-month-year@time , eg for time: 9:00
    // Reset slot before inserting cell.
    this.clearSlot(slot);

    if (!slot) throw new Error("Designated Slot not located.");
    if (!ACTIVITIES.includes(type))
      throw new Error(`Given activity ${type} not made in ACTIVITES.`);
    // Convert time from hour:min to number
    let numberDuration = timeToNumber(duration);
    if (!isAFloat(numberDuration) || numberDuration >= 24 || numberDuration < 0)
      throw new Error(`Given duration: ${numberDuration} is not valid`);
    const startingCellTime = id.split("@")[1];
    const startingTime =
      startingCellTime.split(":")[0] + ":" + minuteStyle(minutes);

    const endTime = getEndTime(startingTime, numberDuration);
    let displayedExcercise;
    if (type.includes("_")) {
      displayedExcercise = `${capFirst(type.split("_")[0])} ${capFirst(
        type.split("_")[1]
      )}`;
    } else {
      displayedExcercise = capFirst(type);
    }

    const html = `<a href="" class="activity ${type}" data-date-time="${actId}"  style="height: ${
      numberDuration * CELLHEIGHT
    }px; margin-top: ${(minutes / 60) * CELLHEIGHT}px"> 
    <time class="time-display" datetime="">${startingTime}-${endTime}</time>
    <div class="${type}-text">
    ${displayedExcercise}
    </div>
    </a>`;

    slot.insertAdjacentHTML("afterbegin", html);
  }
  clearSlot(slot) {
    slot.innerHTML = "";
  }

  // Controlling clicks on the activities and on the schedule:

  addHandlerSelectActivity(responseFunc) {
    this._parentElement.addEventListener("click", responseFunc);
  }
}

export default new scheduleView();
