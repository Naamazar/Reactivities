import { observable, action } from "mobx";
import { createContext } from "react";
import { IActivity } from "../modules/activities";
import agent from "../api/agent";

class ActivityStore {
  @observable activities: IActivity[] = []; // store our activities
  @observable selectedActivity: IActivity | undefined; // observer for the selected activity
  @observable loadingInitial = false; // loading indicator
  @observable isEditMode = false; // indicator for showing form or not (showing in editMode)


  @action loadActivities = () => {
    this.loadingInitial = true; //start our loading indicator
    agent.ActivitiesRequests.list()
      .then(as => {
        // let acs: IActivity[] = [];
        as.forEach(a => {
          a.date = a.date.split(".")[0];
          this.activities.push(a);
        });
        //setActivities(acs); // cause the setEffect to run again.
      })
      .finally(() => this.loadingInitial = false);
  }; // change an observable

  @action selectActivity = (id : string) => {
      this.selectedActivity = this.activities.find(a => a.id === id);
      this.isEditMode = false;
  }
}

export default createContext(new ActivityStore());
