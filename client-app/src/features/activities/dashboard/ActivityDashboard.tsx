import React, { SyntheticEvent, useContext } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/modules/activities";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";
import {observer} from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
  activities: IActivity[];
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (a: IActivity | null) => void;
  createActivity: (a: IActivity) => void;
  editActivity: (a: IActivity) => void;
  deleteActivity: (e:SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting : boolean;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target
}) => {
  const activityStore = useContext(ActivityStore);
  const {isEditMode, selectedActivity} = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          deleteActivity={deleteActivity}
          submitting ={submitting}
          target={target}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !isEditMode && (
          <ActivityDetails
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {/*display ActivityDetails if user select activity*/}
        {isEditMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            createActivity={createActivity}
            editActivity={editActivity}
            submitting={submitting}
            
          />
        )}
        {/*Display ActivityForm only if we are in editMode*/}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
