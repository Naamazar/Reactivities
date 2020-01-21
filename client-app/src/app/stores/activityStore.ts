import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../modules/activities";
import agent from "../api/agent";

configure({ enforceActions: "always" }); // strict mode enables.

class ActivityStore {
  @observable activityRegistry = new Map();
  //   @observable activities: IActivity[] = []; // store our activities
  @observable activity: IActivity | null = null;; // observer for the selected activity
  @observable loadingInitial = false; // loading indicator
//   @observable isEditMode = false; // indicator for showing form or not (showing in editMode)
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
    //   return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true; //start our loading indicator
    try {
      const as = await agent.ActivitiesRequests.list();
      runInAction("loading activities", () => {
        as.forEach(a => {
          a.date = a.date.split(".")[0];
          this.activityRegistry.set(a.id, a);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("load activities finally", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    // need to cover to cases:
    // 1. clicking on view fron activityList -> we HAVE this activity in this.activityRegistry, therefore no need to GET from server
    // 2. refreshing page of activityDetails or saving it as bookmark to use in the future -> we DON'T HAVE this activity in this.activityRegistry
    let a = this.getActivity(id);
    if (a) {
      this.activity = a;
    } else {
      this.loadingInitial = true;
      try {
        a = await agent.ActivitiesRequests.details(id);
        runInAction("getting activity", () => {
          this.activity = a;
        });
      } catch (error) {
        console.log(error);
      } finally {
        runInAction("get activity finally", () => {
          this.loadingInitial = false;
        });
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id); // return undefined
  };

  @action createActivity = async (a: IActivity) => {
    this.submitting = true;
    try {
      await agent.ActivitiesRequests.create(a);
      runInAction("creating ativities", () => {
        this.activityRegistry.set(a.id, a);
        this.activity = a;
        // this.activities.push(a);
        // this.isEditMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("create activity finally", () => {
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (ac: IActivity) => {
    this.submitting = true;
    try {
      await agent.ActivitiesRequests.update(ac);
      runInAction("editing activity", () => {
        this.activityRegistry.set(ac.id, ac);
        this.activity = ac;
        // this.isEditMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("edit activity finally", () => {
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = e.currentTarget.name;
    try {
      await agent.ActivitiesRequests.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("delete activity finally", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };


}

export default createContext(new ActivityStore());
