//This file contains data types and important constants used throughout the application
// export const ACTIVITIES = {
//   running: { color: "background-color: hsl(96 67% 87%)" },
//   weight_training: { color: "background-color: hsl(187 13% 28%);" },
//   martial_arts: { color: "background-color: hsl(27 87% 70%" },
// };

export const ACTIVITIES = ["running", "weight_training", "martial_art"];

export const CELLHEIGHT = 39;

// primaryInputsLabels and primaryInputsClasses are in tandem.
export const primaryInputsLabels = ["date", "time", "activity", "duration"];
export const primaryInputsClasses = [
  "date-selector",
  "time-of-workout",
  "activity-selector",
  "time-number",
];

export class primaryInput {
  //Details that all primary inputes should have
  constructor(_label, _class, _type, selector_options = Array) {
    this.label = _label;
    this.class = _class;
    this.type = _type;
    if (!_type)
      throw new Error("Type should be specified for all primary inputs");
    if (this.type === "select") {
      if (!selector_options)
        throw new Error(
          "An array of selector values needs to be given when type==select"
        );
      this.selectOptions = [...selector_options];
    }
  }
}

export class Entry {
  constructor(id, date, time, activity, duration) {
    // The above five are required for all entries
    if (!id || !date || !time || !activity || !duration) {
      throw new Error(
        "All four paramters date, time activity and duration must be specified for object"
      );
    }
    this.id = id;
    this.date = date;
    this.time = time;
    this.activity = activity;
    this.duration = duration;
  }
}

// const fs = require("fs");
// const { parse } = require("csv-parse");
// fs.createReadStream("./dist/exec.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     console.log(row);
//   })
//   .on("error", function (error) {
//     console.log(error.message);
//   })
//   .on("end", function () {
//     console.log("finished");
//   });

// body parts to be able to track excercises for
export const BodyParts = [
  "Chest",
  "Shoulders",
  "Triceps",
  "Biceps",
  "Back",
  "Quadriceps",
  "Hamstrings",
  "Calves",
];

// Excercise is to be used for storing workout data in activitiy
export class Excercise {
  constructor(bodytype, exec, sets, reps, weight) {
    this.bodytype = bodytype;
    this.exec = exec;
    this.sets = sets;
    this.reps = reps;
    this.weight = weight;
    this._checkRequired();
    this._assignNA();
  }
  _checkRequired() {
    if (!this.exec || !this.sets || !this.reps)
      throw new Error("Either excercise, sets or reps was not given");
  }
  _assignNA() {
    if (!this.bodytype) this.bodytype = "NA";
    if (!this.weight) this.weight = "NA";
  }
}

const assExcercises = new Object();

assExcercises.Chest = [
  "Barbell Bench Press",
  "Dumbell Bench press",
  "Incline Bench Press",
  "Decline Bench Press",
  "Chest Press Machine",
  "Dumbell Flyes",
  "Cable Flyes",
  "Dips",
  "Push-Ups",
  "Machine Chest Press",
  "Pec Deck Machine",
  "Medicine Ball Chest Throws",
  "Svend Press",
  "Landmine Press",
  "Chest DIps Machine,",
];
assExcercises.Shoulders = [
  "Barbell Shoulder press",
  "Dumbbell shoulder press",
  "Arnold Press",
  "Lateral Raises",
  "Front Raises",
  "Rear Delt Flyes",
  "Upright Rows",
  "Shrugs",
  "Face Pulls",
  "Barbell High Pulls",
  "Cable Lateral Raises",
  "Machine SHoulder Press",
  "Plate Raises",
  "Highstand pushups",
  "Shrug Circles",
  "Cable pulls",
];
assExcercises.Triceps = [
  "Close Grip Bench Press",
  "Reverse Grip Tricep Pushdowns",
  "Dips",
  "OverHead Dumbell Extension",
  "Tricep Pushdowns",
  "Skull Crushers",
  "Tricep Kickbacks",
  "Diamond Pushups",
  "Tricpe Rope Pushdowns",
  "Single-Arm Overhead Dumbbell Extensio",
  "Tricep Bench Dips",
  "Close-Grip Pushups",
  "Reverse Grip Tricep Pushdowns",
  "Tricep PRess Machine",
  "Tricpe Cable Kickbacks",
  "Close-Grip Overhead Barbell Press",
];
assExcercises.Biceps = [
  "Barbell Bicep Curl",
  "Dumbbell Bicep Curl",
  "Preacher Curl",
  "Hammer Curl",
  "Concentraion Curl",
  "Cable Bicep Curl",
  "Incline Dumbbell Curl",
  "Machine Bicep Curl",
  "Zottman Curl",
  "Reverse Curl",
  "Spider Curl",
  "21s",
  "SIngle-Arm Cable Curl",
  "Cross Body Hammer Curl",
  "Static Hold Curl",
];
assExcercises.Quads = [
  "Barbell Squats",
  "Leg press",
  "Dumbell lunges",
  "Leg Extensions",
  "Hack Squats",
  "Bulgarian Split Squats",
  "Step-ups",
  "Smith Machine Squats",
  "Front Squads",
  "Pistol Squats",
  "Box Squats",
  "Sumo Squats",
];
assExcercises.Hamstrings = [
  "Romanian Dead lift",
  "Lying Leg Curls",
  "Standing Leg Curls",
  "Single-leg romanian Deadlift",
  "Glute-Ham Raises",
  "seated leg curls",
  "kettlebell swings",
  "Good mornings",
  "Nordic hamstring curls",
  "Reverse hyper extensions",
];
assExcercises.Calves = [
  "Standing Calf Raises",
  "Seated Calf Raises",
  "Single Leg Calf Raises",
];

export default assExcercises;

// const assExcercises{
//   Chest: ["Barbell Bench Press","Dumbell Bench press","Incline Bench Press","Decline Bench Press","Chest Press Machine","Dumbell Flyes","Cable Flyes","Dips","Push-Ups","Machine Chest Press
//   "Pec Deck Machine","Medicine Ball Chest Throws","Svend Press","Landmine Press","Chest DIps Machine,"],

// }
