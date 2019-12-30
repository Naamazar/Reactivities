import React from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/modules/activities";
import { ActivityList } from "./ActivityList";
import { ActivityDetails } from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";

interface IProps {
  activities: IActivity[];
  selectAnActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  isEditMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (a: IActivity | null) => void;
  createActivity: (a: IActivity) => void;
  editActivity: (a: IActivity) => void;
  deleteActivity: (id: string) => void;
}

export const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectAnActivity,
  selectedActivity,
  isEditMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectAnActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !isEditMode && (
          <ActivityDetails
            activity={selectedActivity}
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
          />
        )}
        {/*Display ActivityForm only if we are in editMode*/}
      </Grid.Column>
    </Grid>
  );
};
