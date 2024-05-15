import { primaryInputsLabels } from "../config";
import { removePrimary } from "../helpers";

class activityEditorView {
  _sideBar = document.querySelector("side-bar");
  openEditor(activity = Object) {
    console.log("Here is activity.");
    console.log(activity);
    const beginHTML = `<form class="primary-information">`;
    const primaryHTML = `
    <div class="primary-div">
    <span class="primary-span"> Date: </span>
  <input class="date-selector primary-input"type="date" value="${activity.date}" required="required">
  </div>
  <div class="primary-div">
<span class="primary-span">Time:</span>
<input type="time" class="time-of-workout primary-input" value="${activity.time}" required="required">
</div>
<div class="primary-div">
<span class="primary-span">Activity:</span>
<select class="activity-selector primary-input" value="${activity.activity}" required="required">
  <option value=""> Choose activity</option>
  <option value="weight_training">Weight Training</option>
  <option value ="running"> Running</option>
</select>
</div>
<div class="primary-div">
<span class="primary-span"> Duration: </span>
<input type="" class="time-selector primary-input" value="${activity.duration}" required="required"  value="hour:min">
</div> 
`;
    const endPrimaryHTML = `</form>`;

    const secondaryActivities = removePrimary(activity);
    console.log("Here is secondaryActivities");
    console.log(secondaryActivities);
    const secondaryHTML = this.makeForm(secondaryActivities);

    const HTML = beginHTML.concat(primaryHTML, secondaryHTML);
  }
  makeSecondaryForm(secondaryActivities) {}
}

export default new activityEditorView();
