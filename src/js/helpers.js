import { CELLHEIGHT, primaryInputsLabels } from "./config.js";
import { Entry } from "./model.js";

export const capFirst = function (text = String) {
  //Capitalizes first charactor of given string
  if (!text) throw new Error("An actual string must be passed onto capFirst");

  return text[0].toUpperCase() + text.slice(1);
};

export const lowFirst = function (text = String) {
  if (!text) throw new Error("An actual string must be passed onto lowFirst");
  return text[0].toLowerCase() + text.slice(1);
};

export const suitableLabel = function (str = String) {
  // turns words into sutable Labels specifficaly for input fileds.
  if (typeof str != "string")
    throw new Error(
      `String must be passed onto suitableLabel. Got ${typeof str} instead.`
    );
  let parts = str.split("_");
  if (parts.length === 1) return capFirst(str);
  let completedLabel = "";
  parts.forEach(function (part) {
    completedLabel = completedLabel.concat(capFirst(part) + " ");
  });
  return completedLabel.slice(0, -1); // just to ignore the space added by the for loop
};

export const validDuration = function (time = String()) {
  //checks to see if input is in --:-- format
  const splitedTime = time.split(":");
  if (splitedTime.length > 2) return false;
  return (
    isFinite(parseInt(splitedTime[0])) && isFinite(parseInt(splitedTime[1]))
  );
};

export const timeToNumber = function (time = String()) {
  if (!time.includes(":")) throw new Error(`Invalid time given: ${time}`);
  let hours = parseFloat(time.split(":")[0]);
  let minutes = parseFloat(time.split(":")[1]) / 60;
  let convertedTime = hours + minutes;
  return convertedTime.toFixed(1);

  //gets 00:00 and returns its equivalent hour's e.g. 1:20 -> 1.33
};

export const isAFloat = function (num) {
  const isNum = Number.isFinite(num);
  const isFloat = !(num % 1 === 0);
  const isN = num % 1 === 0;
  return Number.isFinite(num) || !(num % 1 === 0) || num % 1 === 0;
};

export const getConsecutiveDates = function (seconds) {
  let dates = [];
  for (let i = 0; i < 7; i++) {
    dates.unshift(new Date(seconds * 1000));
    seconds -= 86400;
  }
  dates = dates.map(
    (date) => `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  );
  return dates;
};

export const getEndTime = function (startingTime, duration) {
  //Shady
  var endHour = parseInt(startingTime.split(":")[0]) + Math.floor(duration);
  var endMinute = parseInt(startingTime.split(":")[1]);
  +duration % 1;
  return `${endHour}:${String(endMinute).padStart(2, "0")}`;
};

export const getTodayDisplayDate = function (epoch_seconds) {
  //return the display date of day of funbction call
  const date = new Date(epoch_seconds * 1000);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export const getPriorDisplayDate = function (epoch_seconds) {
  // return the display date for 6 days prior to standard_seconds
  const prior_seconds = epoch_seconds - 3600 * 24 * 6;
  const priorDate = new Date(prior_seconds * 1000);
  return `${priorDate.getFullYear()}/${
    priorDate.getMonth() + 1
  }/${priorDate.getDate()}`;
};

export const translateDate = function (date = String) {
  //changed parameter name from time to date
  // changes year--month--day format to day--month--year
  if (!date) throw new Error("No time given.");
  var timeList = date.split("-");
  if (timeList[2].length === 4) {
    return date;
  }
  return timeList[2] + "-" + timeList[1] + "-" + timeList[0];
};
export const retranslateDate = function (date = String) {
  // cahnges day--month--year format to day--month--year
  if (!date) throw new Error("No time given.");
  var timeList = date.split("-");
  if (timeList[0].length === 4) {
    return date;
  }
  const retranslated = timeList[2] + "-" + timeList[1] + "-" + timeList[0];
  return retranslated;
};

export const getDayIndexFromEpoch = function (epoch_seconds) {
  if (!epoch_seconds) throw new Error("Epoch seconds not given.");
  const date = new Date(epoch_seconds * 1000);
  let day = date.getDate();
  console.log("Day is: ", day);
  if (day > 6) {
    day = day % 7;
  }
  return day + 1;
};

export const convertToProperType = function (data, type) {
  // these types are activity typoes
  if (!data) return false;
  if (type === "number") return parseFloat(data);
  if (type === "selector") return data;
  return data;
};

export const floorTime = function (time = String) {
  // return string on the hour from given time in hours:min format and return remaining minutes

  const splittedTime = time.split(":");
  if (splittedTime[1] === "00") {
    return [time, 0];
  }

  const flooredHours = splittedTime[0] + ":00";
  const minutes = parseInt(splittedTime[1]);
  return [flooredHours, minutes];
};

export const minuteStyle = function (min = Int16Array) {
  // takes min in int and turns it into 00 format, eg: 4: 04
  if (min > 59)
    throw new Error(
      `Invalid minutes given:${min} Minutes must be less than 60.`
    );
  if (min > 10) return String(min);
  return "0" + String(min);
};

export const removePrimary = function (activities) {
  const act = activities;
  primaryInputsLabels.forEach((label) => delete act[label]);

  return act;
};

export const solidifyExtractedData = function (extractedEntries = Object) {
  // makes sure that extractedData fromt the sidebar matches the types and formats used in entries for the database,
  // whenver you want to make a new restriction, you can ammend the details here.
  if (!extractedEntries instanceof Object)
    throw new Error(
      "Given new entries must be of type Object. Type right now is: ",
      typeof extractedEntries
    );
  if (typeof extractedEntries["date"] === "string") {
    extractedEntries["date"] = reversifyDate(extractedEntries["date"]);
  }

  return extractedEntries;
};

const reversifyDate = function (date) {
  //given date it of type year-month-day
  // should turn it into day-month-year
  const splittedDate = date.split("-");
  if (splittedDate[2].length === 4) {
    // Date does not need to be reversified. Already in correct order.
    return date;
  }
  const reversifiedDate = date.split("-").reverse().join("-");
  return reversifiedDate;
};

export const standarDateString = function (date) {
  // a standardDateString should look like: day-month-year and have outline: 00-00-0000
  let splittedDate = date.split("-");
  if (splittedDate[0].length === 4) {
    splittedDate = reversifyDate(splittedDate);
  }
  let [day, month, year] = splittedDate;
  if (day.length === 1) day = "0".concat(day);
  if (month.length === 1) month = "0".concat(month);

  return `${day}-${month}-${year}`;
};

export const standardTimeString = function (time) {
  // a standardTimeString should look like: hour:minute an dhave outline: 00:00
  const splittedTime = time.split(":");
  if (splittedTime.length !== 2)
    throw new Error(`Invalid time given: ${time}. should have outline 00:00`);
  let [hours, seconds] = splittedTime;
  if (hours.length === 1) hours = "0".concat(hours);
  if (seconds.length === 1) seconds = "0".concat(seconds);

  return `${hours}:${seconds}`;
};

export const correctDurationFormat = function (dur = String) {
  return true;
};

export const sortEntires = function (entries) {
  // sorts array pf items of type Entry by date string
  // these class tokens have attribute date. Note; funciton is self recursive
};
