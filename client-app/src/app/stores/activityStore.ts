import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../modules/activities";
import agent from "../api/agent";

configure({ enforceActions: "always" }); // strict mode enables.

class ActivityStore {
  @observable activityRegistry = new Map();
  //   @observable activities: IActivity[] = []; // store our activities
  @observable selectedActivity: IActivity | undefined; // observer for the selected activity
  @observable loadingInitial = false; // loading indicator
  @observable isEditMode = false; // indicator for showing form or not (showing in editMode)
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
          // this.activities.push(a);
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
    }
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    //   this.selectedActivity = this.activities.find(a => a.id === id);
    this.isEditMode = false;
  };

  @action createActivity = async (a: IActivity) => {
    this.submitting = true;
    try {
      await agent.ActivitiesRequests.create(a);
      runInAction("creating ativities", () => {
        this.activityRegistry.set(a.id, a);
        this.selectedActivity = a;
        // this.activities.push(a);
        this.isEditMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("create activity error", () => {
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
        this.selectedActivity = ac;
        this.isEditMode = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("edit activity error", () => {
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
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  @action openCreateForm = () => {
    this.isEditMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.isEditMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
    this.isEditMode = false;
  };

  @action cancelFormOpen = () => {
    this.isEditMode = false;
  };
}

export default createContext(new ActivityStore());
