import { suitableLabel } from "./helpers";
import { primaryInput, Entry } from "./config.js";

export const ActivityEntries = {
  weight_training: [
    { label: "excercise", type: "selector" },
    { label: "sets", type: "number" },
    { label: "reps", type: "number" },
    { label: "weight", type: "number" },
  ],
  running: [
    { label: "zone", type: "number" },
    { label: "pace", type: "number" },
  ],
};

export const allInputValues = {
  date: null,
  time: null,
  activity: null,
  duration: null,
};

export const primaryInputDetails = {};

// The primary inputs to be displayed in sidebar, these inputs are to be added to array: primaryInputs
const PrimaryDate = new primaryInput("Date", "date-selector", "date");
const PrimaryTime = new primaryInput("Time", "time-of-workout", "time");

const PrimaryActivity = new primaryInput(
  "Activity",
  "activity-selector",
  "select",
  ["weight_training", "running"]
);
const PrimaryDuration = new primaryInput("Duration", "time-number", "duration");

export const primaryInputs = [
  //is to be accessed by controller.js and siebar.js to show elementary activities
  PrimaryDate,
  PrimaryTime,
  PrimaryActivity,
  PrimaryDuration,
];

// TODO: allEntries should be connected to a local memoery later e.g database
// allEntries must contain only elements of class Entry

export const allEntries = Array();

// Here are some created activities to be used while testing
const sessionOne = new Entry(
  (id = 1),
  (date = "07-04-2024"),
  (time = "16:00"),
  (activity = "running"),
  (duration = "1:20")
);
const sessionTwo = new Entry(
  (id = 2),
  (date = "12-04-2024"),
  (time = "08:00"),
  (activity = "weight_training"),
  (duration = "1:00")
);
const sessionThree = new Entry(
  (id = 3),
  (date = "01-04-2024"),
  (time = "08:00"),
  (activity = "martial_art"),
  (duration = "4:00")
);
allEntries.push(sessionOne, sessionTwo, sessionThree);

export const fetchActivity = function (date, time) {
  //this function is called when an activity is clicked in the schedule.
  console.log(`Looking for activity with date: ${date} and time: ${time} `);
  console.log(`Looking in allEntries: `, allEntries);
  const foundActivity = allEntries.find((activity) => {
    let case1 = activity.date === date;
    let case2 = activity.time === time;
    return case1 && case2;
  });
  if (!foundActivity)
    throw new Error(
      `Acctivity with id "${date}@${time} was not found in allEntries."`
    );
  console.log("Returning activity.");
  return foundActivity;
};

export const getAllActivities = function () {
  return allEntries;
};

export const getWeeklyActivities = function (start_date, end_date) {
  // Should all entries of type Enty in date order from start_date to end_date
  return undefined;
};

export const checkEntry = function (entry = Object) {
  //check latest entry to make sure it satisfies save and fetched for data.
  // entry is bound to have the primaryinfo
  const errors = Array();
  // Just grab entries right away. Making an interacting way to do this is remote but complicated. Its not necessary.
  if (errors.length !== 0) return false;
  return true;
};

export const removeDuplicate = function (date, time) {
  // removes the complete entry with date and time from allEntrie
  console.log(date);
  console.log(time);
  const duplicateIndex = allEntries.findIndex(
    (entry) => entry.date === date && entry.time === time
  );
  if (duplicateIndex > -1) allEntries.splice(duplicateIndex, 1);
};

class Model {
  getDayOfWeek() {
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  }

  getDate() {
    return new Date().getTime() / 1000;
  }
}

export default new Model();

class ActivitySlot {
  constructor(date, time, duration) {
    this.date = date;
    this.time = time;
    this.duration = duration;
  }
}

export class MartialArt extends ActivitySlot {
  constructor(date, time, duration) {
    super(date, time, duration);
    this.type = "martial_art";
  }
}

export class Run extends ActivitySlot {
  constructor(date, time, duration) {
    super(date, time, duration);

    this.type = "running";
  }
}

export class WeightTraining extends ActivitySlot {
  constructor(date, time, duration, excercises) {
    //excercises must be class excercise
    super(date, time, duration);
    this.excercises = excercises;
    this.type = "weight_training";
  }
}

export class WeightExcercise {
  constructor(excerciseName, sets, reps, weight = 0) {
    this.excerciesName = excerciseName;
    this.sets = sets;
    this.reps = reps;
    this.weight = weight;
  }
}
