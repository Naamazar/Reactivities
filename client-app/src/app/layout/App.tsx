import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../modules/activities";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]); // [] = init state
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false); // type boolean
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState(''); // name of the button that was clicked

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setIsEditMode(false);
  };

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
    agent.ActivitiesRequests.list()
      .then(response => {
        let acs: IActivity[] = [];
        response.forEach(a => {
          a.date = a.date.split(".")[0];
          acs.push(a);
        });
        setActivities(acs); // cause the setEffect to run again.
      })
      .then(() => setLoading(false));
  }, []); // [] as seconds parameter ansure that the useEffect will only be execute one time.

  if (loading) {
    return <LoadingComponent content="Locading activities..." />;
  }
  // render() {
  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectAnActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          isEditMode={isEditMode}
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

export default App;
