import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../modules/activities";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]); // [] = init state
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false); // type boolean

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setIsEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setIsEditMode(true);
    setSelectedActivity(null);
  };

  const handleCreateActivity = (a: IActivity) => {
    setActivities([...activities, a]);
    setSelectedActivity(a);
    setIsEditMode(false);
  };

  const handleEditActivity = (ac: IActivity) => {
    setActivities([...activities.filter(a => a.id !== ac.id), ac]);
    setSelectedActivity(ac);
    setIsEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then(response => {
        let acs : IActivity[]= [];
        response.data.forEach(a => {
          a.date = a.date.split('.')[0];
          acs.push(a);
        })
        setActivities(acs); // cause the setEffect to run again.
      });
  }, []); // [] as seconds parameter ansure that the useEffect will only be execute one time.

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
        />
      </Container>
    </Fragment>
  );
};

export default App;
