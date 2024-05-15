import scheduleView from "./view/scheduleView.js";
import sideBarView from "./view/sideBarView.js";
import desktopView from "./view/desktopView.js";
import activityEditorView from "./view/activityEditorView.js";
import {
  consecutive,
  translateDate,
  convertToProperType,
  getEndTime,
  solidifyExtractedData,
  standarDateString,
} from "./helpers.js";
import Model, {
  ActivityEntries,
  allInputValues,
  allEntries,
  fetchActivity,
  primaryInputs,
  removeDuplicate,
  checkEntry,
} from "./model.js";
import model, { ActivityEntries } from "./model.js";
import { ACTIVITIES, Entry } from "./config.js";
import { extract } from "jest-docblock";
import { valid } from "semver";
import { clearSource } from "msgpackr";

var curActivity;
const popUpSecondaryForm = function () {
  // function is fired off when an input is placed into input activity
  curActivity = document.querySelector(".activity-selector").value;
  if (!curActivity) return false;
  if (curActivity === "add") {
    sideBarView.openActivityCreator();
    //Close secondaries for neatness:
    sideBarView.removeSecondaryEntries();
  } else {
    //close eactivityCreator for neatness:
    sideBarView.removeActivityCreator();

    sideBarView._insertSecondaryFormHTML(curActivity, extractEntireForm); //activity must be from the values of selector
  }
};

const extractEntireForm = function (e) {
  //TODO: Switch to extract entire form.
  //passed on to second form submit button in init()

  try {
    e.preventDefault();
  } catch {
    console.log("Didn't work");
  }

  const extractedEntries = sideBarView.extractAllEntries(curActivity);

  console.log("Here is extractedInfo: ", extractedEntries);
  solidifiedExtractedEntries = solidifyExtractedData(extractedEntries); //curently just extracts priamry data into a class Entry
  console.log(
    "Here is solidifed ExtractedEntries:",
    solidifiedExtractedEntries
  );

  const validEntries = checkEntry(solidifiedExtractedEntries); //checks for falses and
  if (!validEntries) {
    console.log("Invalid Entries");
    return;
  }

  //remove same date entry if it exists as it may be revised version.
  removeDuplicate(
    solidifiedExtractedEntries["date"],
    solidifiedExtractedEntries["time"]
  );
  //Move activity into allEntries -> later database
  allEntries.push(solidifiedExtractedEntries);

  //call scheduleView to display all the activities again.

  console.log("allEntries after push: ");
  console.log(allEntries);
  scheduleView.insertAllActivities(allEntries);

  //Turn the extracted information into proper type before entering them into allEntries:
};

const findSelectedElement = function (e) {
  // on click fo element on sidebar, finds it in database and opens sidebar for edit
  e.preventDefault();
  activityElement = e.target.closest(".activity");
  console.log(activityElement);
  if (!activityElement) return;
  dateTime = activityElement.dataset.dateTime; //Format is day-month-year@hour:min , e.g. 13-0-2024@8:00
  if (!dateTime)
    throw new Error(activatedAt, " does not contain data-date-time");
  const date = dateTime.split("@")[0];
  const time = dateTime.split("@")[1];
  var fetchedActivity = fetchActivity(date, time);
  //Open activityeditor in sidebar
  sideBarView.openActivityEditor(fetchedActivity);

  //eventlistner on activity changing:
  sideBarView.addHandlerEnterActivity(popUpSecondaryForm);

  //Eventlistener on form being submitted
  const submitBtn = document.querySelector(".submit-btn");
  if (!submitBtn)
    throw new Error(
      "Submit Btn should have been created in openActivityEditor"
    );
  submitBtn.addEventListener("click", extractEntireForm);
  //make
};
// Initialize application
const init = function () {
  const day = Model.getDayOfWeek();
  const seconds = Model.getDate();
  //extractPrimaryForm passed on here goes on to be passed to sideBarView.addHandlerEnterActivity()
  sideBarView.initialize((primaryInputs = primaryInputs));
  sideBarView.addhandlerTrackBtn(popUpSecondaryForm);
  // sideBarView.addHandlerEnterActivity(extractPrimaryForm);

  // Insert all columns of table (with pre-existent data). Also adds the time table to its left through a function call.
  scheduleView.initialize(day, seconds);

  scheduleView.updateEntries(allEntries);
  scheduleView.insertAllActivities();
  // setup sidebar -> later should be given to a button
  sideBarView.ActivityEntries = ActivityEntries; // Give initial Activity Entries to sideBar to use

  // sideBarView.addHandlerSubmitActivity(extractPirmaryForm);

  scheduleView.addHandlerSelectActivity(findSelectedElement);
};

init(); //initializes program
