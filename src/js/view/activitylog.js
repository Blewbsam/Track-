import { allEntries } from "../model.js";
import assExcercises from "../config.js";

console.log(assExcercises.Triceps[0]);

class activitylog {
  constructor() {
    this.allEntries = allEntries;
    console.log(this.allEntries);

    this.activitylog = document.querySelector(".activity-log");
    if (!this.activitylog)
      throw new Error("aside element with class .activity-log doesn't exist");
    if (!this.allEntries)
      throw new Error("allEntries was not passed onto constructor.");
  }
  insert_entries() {
    // scroll_index is to be used to see which activities are to be displayedo n hte screen
    this.scroll_index = 0;
    //1. get entries in order
    this.sortedEntries = this.allEntries; //not sure how to sort such array of type Entry
    //2. extract primary and secondary information
    //3.create HTML for primary informaiton
    const HTML = this.constructHTML();

    //4.display primary and secondary information and add eventhandler to button by providing it with correct button id.
    this.activitylog.insertAdjacentHTML("beforeend", HTML);
    this.addViewButtonHandlers();
    //5. make it clickable
  }
  constructHTML() {
    const begin_index = this.scroll_index * 20;
    const end_index = begin_index + 20;
    var displayingEntries = this.sortedEntries.slice(begin_index, end_index);
    let HTML = "";
    for (var i = 0; i < displayingEntries.length; i++) {
      let entry = displayingEntries[i];
      console.log(entry.id);
      var elemHTML = `<div class="activity-entry" id="activity-entry-${entry.id}">
      <h4 class="date-entry">${entry.date}</h4>
      <h4 class="time-entry">${entry.time}</h4>
      <h4 class="activity-type-entry">Weight Lifting</h4>
      <h4 class="duration-entry">${entry.duration}</h4>
    </div>`;
      HTML = HTML.concat(elemHTML);
    }
    return HTML;
  }
  addViewButtonHandlers() {
    // looks for all divs with class "activity-entry" and adds handlers with associated callbacks with respect to entry's id assoiated in btns id
    const btns = document.querySelectorAll(".activity-entry");
    for (let i = 0; i < btns.length; i++) {
      let currentBtn = btns[i];
      let curID = currentBtn.id.split("-")[2]; //id is of the form "activity-entry-${id}"
      currentBtn.addEventListener(
        "click",
        function () {
          this.displaySecondaryInformation(curID);
        }.bind(this),
        false
      );
    }
  }

  displaySecondaryInformation(EntryId) {
    console.log("got call from activity with enry id");
    console.log(EntryId);
    //called by eventlistener defined in addViewButtonHandlers
    // displays workout fully on screen
  }
}

export default new activitylog();
