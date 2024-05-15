import {
  getAllActivities,
  getWeeklyActivities,
  getAllActivities,
} from "./model.js";
import activityLog from "./view/activitylog.js";

const allEntries = getAllActivities();

// const activityLog = new activityLog(allEntries);

const init = function () {
  //funciton gets called to to initialize web page

  activityLog.insert_entries();
};

init();
