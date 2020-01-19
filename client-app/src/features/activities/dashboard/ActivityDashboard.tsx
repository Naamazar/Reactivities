import React, {useContext } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import {observer} from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';


const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {isEditMode, selectedActivity} = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !isEditMode && (
          <ActivityDetails />
        )}
        {/*display ActivityDetails if user select activity*/}
        {isEditMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}            
            activity={selectedActivity!}            
          />
        )}
        {/*Display ActivityForm only if we are in editMode*/}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
