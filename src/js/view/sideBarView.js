import {
  validDuration,
  capFirst,
  convertToProperType,
  suitableLabel,
  lowFirst,
  retranslateDate,
} from "../helpers";
import { primaryInputsClasses, primaryInputsLabels } from "../config";

class sideBarView {
  _primaryForm = document.querySelector(".primary-information");
  _secondaryForm = document.querySelector(".secondary-information");
  _sideBar = document.querySelector(".side-bar");
  _trackBtn = document.querySelector(".make-sidebar-appear"); // trackBtn is the btn on desktop
  _closeBtn;
  _addedListenerCloseBtn = Boolean();
  ActivityEntries;
  entries = { date: null, time: null, activity: null, duration: null };

  initialize(primaryInputs = array) {
    //primaryInputs is to have type of object: primaryInput defined in model.js
    this.primaryInputs = primaryInputs;
  }

  //Selectors
  selectCloseBtn() {
    this._closeBtn = document.querySelector(".close-button");
    if (!this._closeBtn)
      throw new Error("Element with class .close-button was not found.");
  }
  selectPrimaryInfo() {
    this._primaryForm = document.querySelector(".primary-information");
    if (!this._primaryForm)
      throw new Error("Element with class .primary-information was not found");
  }

  selectPrimaryInfoElements() {
    this._date = document.querySelector(".date-selector");
    this._time = document.querySelector(".time-of-workout");
    this._activity = document.querySelector(".activity-selector");
    this._duration = document.querySelector(".time-selector");
  }

  selectSecondaryInfo(mustExist = Boolean) {
    this._secondaryForm = document.querySelector(".secondary-information");
    if (!this._secondaryForm && mustExist)
      throw new Error(
        "Element with class .secondary-information was not found."
      );
  }

  selectActivityCreator() {
    this._activityCreator = document.querySelector(".activity-creator");
    if (!this._activityCreator)
      throw new Error("Element with class .activity-creator was not found.");
  }

  selectAddInputBtn() {
    this._addBtn = document.getElementById("add-Btn");
    if (!this._addBtn)
      throw new Error("Element with id add-Btn was not found.");
  }

  selectSaveCreatorBtn() {
    this._saveBtn = document.getElementById("save-Btn");
    if (!this._saveBtn)
      throw new Error("Element with id save-Btn was not found.");
  }

  selectCreatorForm() {
    this._creatorForm = document.querySelector(".activity-information");
    if (!this._creatorForm)
      throw new Error(
        "Element with class .activity-information was not found."
      );
  }

  //handlers
  addhandlerTrackBtn(extractFunc) {
    this._trackBtn.addEventListener(
      "click",
      this.openSideBar.bind(this, extractFunc)
    );
  }
  addHandlerEnterActivity(func) {
    const activityInput = document.querySelector(".activity-selector");
    activityInput.addEventListener("input", func);
  }

  addHandlerCloseBtn() {
    if (!this._closeBtn) {
      this._closeBtn = document.querySelector(".close-button");
    }
    if (!this._closeBtn)
      throw new Error("Close btn not found: ", this._closeBtn);
    this._closeBtn.addEventListener("click", this.closeSideBar.bind(this));
  }

  addHandlerSecondSubmitActivity(activitity_key, responseFunc) {
    // this._secondaryForm = document.querySelector(".secondary-information"); //
    this.selectSecondaryInfo();
    this._secondaryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      responseFunc(activitity_key);
    });
  }

  addHandlerAddandSave() {
    // using select functions leads to bug for some reason. remodify addHandlerAddandSave if you can find the problem with the selection.
    // adding eventlistener for addBtn
    const addBtn = document.getElementById("add-Btn");
    if (!addBtn) throw new Error("Element with id add-Btn was not found.");
    addBtn.addEventListener("click", this.addInput.bind(this));

    //adding eventlistenner for saveBTn
    const saveBtn = document.getElementById("save-Btn");
    if (!saveBtn) throw new Error("Element with id save-Btn was not found.");
    saveBtn.addEventListener("click", this.saveInputs.bind(this));
  }

  // Direct sideBar functions:

  openSideBar(extractFunc) {
    this._sideBar.classList.remove("hidden");

    this.insertActivityEntries();
    this.selectPrimaryInfoElements();
    this.addHandlerEnterActivity(extractFunc); //extractFunc is extractPrimaryForm
    this.addHandlerCloseBtn();
  }

  closeSideBar() {
    // removes HTML from sidebar and changes its visibility
    // Called by eventListener on _closeBtn
    // Remove all the HTML and their eventlisteners.
    // primaryInfo and closeBtn will exist for sure so shouldn't be gaurded against not existing.

    this.removePrimaryEntries();
    this.removeSecondaryEntries();

    //remove add activity entries
    const activityCreator = document.querySelector(".activity-creator");
    if (activityCreator) {
      activityCreator.innerHTML = "";
      activityCreator.classList.add("hidden");
    }
    //just removing HTML will keep eventListeners and this may lead to bugs later on: be careful.

    //change sideBar visibility
    const sideBar = document.querySelector(".side-bar");
    sideBar.classList.add("hidden");
  }

  // Entries insertion and exrtraction:

  //Primaries:
  insertActivityEntries() {
    // decided to have Button HTML be in starting index.html
    let HTML = `<form class="primary-information">`;
    let blockHTML;
    this.primaryInputs.forEach(function (primaryInput) {
      //primary input it to have .label,.class,.type variables stores.
      // and .selectOptions if (activity==="select")
      if (primaryInput.type === "select") {
        blockHTML = makePrimaryInputBlockHTML(
          primaryInput.label,
          primaryInput.class,
          primaryInput.type,
          "",
          primaryInput.selectOptions
        );
      } else {
        blockHTML = makePrimaryInputBlockHTML(
          primaryInput.label,
          primaryInput.class,
          primaryInput.type
        );
      }
      HTML = HTML.concat(blockHTML);
    });
    this._sideBar.insertAdjacentHTML("beforeend", HTML);
  }

  extractPrimaries() {
    //Extracts the first 4 entries in the sidebar.
    const extractedPrimary = {};
    for (let i = 0; i < primaryInputsLabels.length; i++) {
      let elem = document.querySelector(`.${primaryInputsClasses[i]}`);
      let properValue = convertToProperType(elem.value, elem.type);
      extractedPrimary[primaryInputsLabels[i]] = properValue;
    }
    return extractedPrimary;
  }

  notValidPrimaryInputs() {
    if (this._date.value === "") return "Please enter a valid date.";
    if (this._time.value === "") return "Please enter the time of activity.";
    if (this._activity.value === "") return "Please choose an activity.";
    if (this._duration.value === "" || !validDuration(this._duration.value))
      return `Please specify duraiton of activty. ${this._duration.value} is not a valid input`;
    return "valid";
  }
  resetPrimaryInputs() {
    this._date.value = "";
    this._time.value = "";
    this._activity.value = "";
    this._duration.value = "";
  }

  //Secondaries:

  _insertSecondaryFormHTML(activity_key, extractFunc) {
    this.selectSecondaryInfo(false);
    if (this._secondaryForm) this._sideBar.removeChild(this._secondaryForm);
    const html = this._createSecondaryFormHTML(activity_key);
    this._sideBar.insertAdjacentHTML("beforeend", html);
    this.addHandlerSecondSubmitActivity(activity_key, extractFunc);
    // responeFunc should extract entire form
  }

  _createSecondaryFormHTML(activity_key) {
    const entries = this.ActivityEntries[activity_key];

    let html = `<form class="secondary-information">`;

    entries.forEach(
      (set) =>
        (html = html.concat(` 
        <div class="secondary-div">
        <span class="primary-span" >${capFirst(set.label)}: </span>
    <input class="${set.label}-${set.type} secondary-input" type="${set.type}">
    </div>`))
    );
    html =
      html.concat(`<div class="secondary-div"> <button class="secondary-input submit-btn">Track!</button> </div>
    </form>`);
    return html;
  }

  extractSecondaries(classes = Array) {
    //extract the rest of the activitiexs that where not extractesd by extract Primaries.
    if (!classes || !Array.isArray(classes))
      throw new Error(
        "Proper classes where have not been given to extract secondary information. "
      );
    const extractedSecondary = {};
    for (let i = 0; i < classes.length; i++) {
      let data = document.querySelector(`.${classes[i]}`).value;
      let label = lowFirst(classes[i].split("-")[0]);
      extractedSecondary[label] = data;
    }
    return extractedSecondary;
  }

  getSecondaryClasses(secondEntriesActivityType) {
    //input is array of objects with keys label and type:
    // output will be "label-type" of each array.
    if (!Array.isArray(secondEntriesActivityType))
      throw new Error(
        "Given input must be array and include objects with keys label and type only."
      );
    let classes = Array();
    secondEntriesActivityType.forEach((obj) => {
      let tempstr = obj["label"] + "-" + obj["type"];
      classes.push(tempstr);
    });

    return classes;
  }

  //Both:

  extractAllEntries() {
    //gets input value for all inputs with class primary-input or secondary-input
    const primaryInputExtractions = this.extractPrimaries();
    let primaryActivity = this.extractPrimaries();
    // must pass on activity type to extractSecondaries()
    const secondEntriesActivityType =
      this.ActivityEntries[primaryActivity["activity"]];
    const classes = this.getSecondaryClasses(secondEntriesActivityType);
    const secondaryInputsExtracted = this.extractSecondaries(classes);
    const allExtractedEntries = {
      ...primaryInputExtractions,
      ...secondaryInputsExtracted,
    };
    return allExtractedEntries;
  }

  //Following functions are used when entries are being extracted:.

  openActivityEditor(activity) {
    this.addHandlerCloseBtn();
    //openActivityEditor called when an activity in the scheduleView is clicked upon.
    // it opens the sidebar so that person can see previously defined activitiy.
    // Person should be able to change activity and activity selector should be responsive.

    //CLOSE and ClEAR previous sideBar If open:
    const sideBarElement = document.querySelector(".side-bar");
    if (!sideBarElement.classList.contains("hidden"))
      sideBarElement.classList.add("hidden");

    const primaryFormElems = document.querySelectorAll(".primary-information");
    const secondaryFormElems = document.querySelectorAll(
      ".secondary-information"
    );
    if (primaryFormElems)
      primaryFormElems.forEach((primeElem) => primeElem.remove());
    if (secondaryFormElems)
      secondaryFormElems.forEach((secondaryElem) => secondaryElem.remove());

    //generate Primary HTML:
    let HTML = `<form class="primary-information">`;
    let blockHTML;

    this.primaryInputs.forEach(function (primaryInput) {
      if (primaryInput.type === "select") {
        blockHTML = makePrimaryInputBlockHTML(
          primaryInput.label,
          primaryInput.class,
          primaryInput.type,
          activity[lowFirst(primaryInput.label)],
          primaryInput.selectOptions
        );
      } else {
        blockHTML = makePrimaryInputBlockHTML(
          primaryInput.label,
          primaryInput.class,
          primaryInput.type,
          activity[lowFirst(primaryInput.label)]
        );
      }
      HTML = HTML.concat(blockHTML);
    });
    const primaryHTML = HTML.concat(`</form>`);

    // filteredActivity is the activity but with the primary information removed.
    const filteredActivitiy = Object.assign({}, activity);

    let activityLabel;
    this.primaryInputs.forEach((primaryInput) => {
      activityLabel = lowFirst(primaryInput.label);
      delete filteredActivitiy[activityLabel];
    });

    // generate secondary HTML;
    const actualActivity = activity["activity"];
    const secondaryEntries = this.ActivityEntries[actualActivity];
    // filteredactivity:

    let secondaryHTML = `<form class="secondary-information">`;
    blockHTML = "";
    let associatedEntryDetails;
    for (const entry in filteredActivitiy) {
      associatedEntryDetails = secondaryEntries.find(
        (ent_) => ent_.label === entry
      );
      if (!associatedEntryDetails) {
        throw new Error("type not found. Check in secondaryEntries for label.");
      }

      blockHTML = makeSecondaryInputBlockHTML(
        entry,
        associatedEntryDetails.type,
        filteredActivitiy[entry]
      );
      secondaryHTML = secondaryHTML.concat(blockHTML);
    }

    secondaryHTML =
      secondaryHTML.concat(`<div class="secondary-div"> <button class="secondary-input submit-btn">Confirm edit</button> </div>
    </form>`);

    const finalHTML = primaryHTML.concat(secondaryHTML);

    //insert HTML:
    sideBarElement.insertAdjacentHTML("beforeend", finalHTML);

    // addeventlistener to confirm eidt button
    document
      .querySelector(".submit-btn")
      .addEventListener("click", this.extractAllEntries.bind(this));

    // selector type can't be turned into HTML and must be set manually:
    var selectorprops = this.primaryInputs.find(
      (primaryInput) => primaryInput.type == "select"
    );

    this.setSelectorValue(selectorprops.class, activity["activity"]);

    //OPEN sideBar with new HTML:
    sideBarElement.classList.remove("hidden");
  }

  setSelectorValue(class_, value) {
    const selector = document.querySelector(`.${class_}`);
    selector.value = value;
  }

  //relavent to activity creator:
  openActivityCreator() {
    console.log("Called");
    const activityCreator = document.querySelector(".activity-creator");
    if (!activityCreator)
      throw new Error("element with class .activity-creator was not found.");

    // create HTML
    const beginElemHTML = `
    <form class="activity-information">
      <span class="primary-span"> Activity: </span>
      <input class="creator-input" type="text">`;
    //   </ select>

    const blockHTML = this.makeInputBlockHTML(); // includes Btns

    const finalElemHTML = beginElemHTML.concat(blockHTML, `</form>`);

    //insert HTML.
    activityCreator.insertAdjacentHTML("afterbegin", finalElemHTML);

    //sekect Btns that were inserted above
    this.selectAddInputBtn();
    this.selectSaveCreatorBtn();

    // addProperEvenListeners.
    this.addHandlerAddandSave();

    //make visible
    activityCreator.classList.remove("hidden");
  }

  makeBtnsHTML() {
    return `<button id="add-Btn" type="button" class="creator-button">Add Input</button>
    <button id="save-Btn" class="creator-button">Save</button>`;
  }

  addInput(event) {
    console.log("Called.");
    event.preventDefault();
    //make HTML:
    const HTML = this.makeInputBlockHTML();

    // remove BTNS that are to be inserted again
    this.removeAddInputBtn();
    this.removeSaveCreatorBtn();

    //get creator form
    this.selectCreatorForm();
    if (!this._creatorForm)
      throw new Error("Problem finding item with class .activity-information");
    this._creatorForm.insertAdjacentHTML("beforeend", HTML);

    //add EventListeners
    this.addHandlerAddandSave();
  }

  saveInputs() {
    // connected to config right now -> will connect to database later.
  }
  makeInputBlockHTML() {
    const inputHTML = `<span class="primary-span"> Input Name: </span>
    <input class="creator-input" type="text">
    <span> Unit of Measurement: </span>
    <input class="creator-input" type="text">`;
    const btnHTML = this.makeBtnsHTML();

    return inputHTML.concat(btnHTML);
  }

  // Systematic removal of elements:
  removeCloseBtn() {
    this.selectCloseBtn();
    if (this._closeBtn) this._closeBtn.remove();
  }

  removePrimaryEntries() {
    this.selectPrimaryInfo();
    if (this._primaryForm) this._primaryForm.remove();
  }

  removeSecondaryEntries() {
    this.selectSecondaryInfo(false);
    if (this._secondaryForm) this._secondaryForm.remove();
  }

  removeActivityCreator() {
    this.selectActivityCreator();
    if (this._activityCreator) {
      this._activityCreator.innerHTML = "";
      this._activityCreator.classList.add("hidden");
    }
  }

  removeAddInputBtn() {
    this.selectAddInputBtn();
    if (this._addBtn) this._addBtn.remove();
  }

  removeSaveCreatorBtn() {
    this.selectSaveCreatorBtn();
    if (this._saveBtn) this._saveBtn.remove();
  }

  // dev support functions
  _showCreatorFormHTML() {
    this.selectActivityCreator();
    const HTML = this._activityCreator.innerHTML;
    console.log(HTML);
    const addBtn = document.getElementById("add-Btn");
    console.log(addBtn);
    addBtn.addEventListener("click", this.addInput.bind(this));
  }
}

export default new sideBarView();

const makePrimaryInputBlockHTML = function (
  label,
  class_,
  type,
  storedValue,
  selectOptions
) {
  if (!label || !class_ || !type)
    throw new Error("All created inputs must have label, class and type.");
  if (type !== "select") {
    var blockHTML = ` <div class="primary-div">
    <span class="primary-span"> ${label}: </span>
    <input class="${class_} primary-input"type="${type}" value="${
      !storedValue ? "" : validInputValues(storedValue, type)
    }" required="required">
    </div>`;
    return blockHTML;
  } else {
    if (!selectOptions)
      throw new Error(
        "selectOptions must be passed to makePrimaryInputBlockHTML if type=select"
      );
    let topHTML = `  <div class="primary-div">
    <span class="primary-span">${label}:</span>
    <select type="${type}" class="${class_} primary-input" value="${
      !storedValue ? "" : validInputValues(storedValue, type)
    }" required="required">
    <option value=""> Choose activity</option>
    <option value="add"> Add Activity</option>`;
    let optionsHTML = ``;
    selectOptions.forEach(function (optionValue) {
      let suitLabel = suitableLabel(optionValue);
      let option = `<option value="${optionValue}">${suitLabel}</option>`;
      optionsHTML = optionsHTML.concat(option);
    });
    let bottomHTML = ` </select> </div>`;
    blockHTML = topHTML.concat(optionsHTML, bottomHTML);
    return blockHTML;
  }
};

const makeSecondaryInputBlockHTML = function (label, type, value) {
  let html = ` 
      <div class="secondary-div">
      <span class="primary-span" >${capFirst(label)}: </span>
  <input class="${label}-${type} secondary-input" value="${value}" type="${type}">
  </div>`;
  return html;
};

const validInputValues = function (value, type) {
  if (type === "date") {
    return retranslateDate(value);
  }
  return value;
};
