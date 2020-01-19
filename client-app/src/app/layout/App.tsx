import React, { useState, useEffect, Fragment, SyntheticEvent, useContext } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../modules/activities";
import { NavBar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import {observer} from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]); // [] = init state
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false); // type boolean
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState(''); // name of the button that was clicked

  const handleOpenCreateForm = () => {
    setIsEditMode(true);
    setSelectedActivity(null);
  };

  const handleCreateActivity = (a: IActivity) => {
    setSubmitting(true);
    agent.ActivitiesRequests.create(a)
      .then(() => {
        setActivities([...activities, a]);
        setSelectedActivity(a);
        setIsEditMode(false);
      })
      .then(() => setSubmitting(false));
  };

  const handleEditActivity = (ac: IActivity) => {
    setSubmitting(true);
    agent.ActivitiesRequests.update(ac)
      .then(() => {
        setActivities([...activities.filter(a => a.id !== ac.id), ac]);
        setSelectedActivity(ac);
        setIsEditMode(false);
      })
      .then(() => setSubmitting(false));
  };

  const handleDeleteActivity = (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    setSubmitting(true);
    setTarget(e.currentTarget.name);
    agent.ActivitiesRequests.delete(id)
      .then(() => {
        setActivities([...activities.filter(a => a.id !== id)]);
      })
      .then(() => setSubmitting(false));
  };

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]); // [] as seconds parameter ansure that the useEffect will only be execute one time.

  if (activityStore.loadingInitial) {
    return <LoadingComponent content="Locading activities..." />;
  }
  // render() {
  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activityStore.activities}
          setEditMode={setIsEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
