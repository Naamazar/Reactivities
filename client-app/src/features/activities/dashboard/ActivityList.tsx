import React, { useContext } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from "mobx-react-lite";



const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {submitting, activitiesByDate, selectActivity, deleteActivity, target} = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map(a => (
          <Item key={a.id}>
            <Item.Content>
              <Item.Header as="a">{a.title}</Item.Header>
              <Item.Meta>{a.date}</Item.Meta>
              <Item.Description>
                <div>{a.description}</div>
                <div>
                  {a.city}, {a.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => selectActivity(a.id)}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Button
                  name={a.id}
                  loading={target===a.id && submitting}
                  onClick={(e) => deleteActivity(e, a.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={a.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};



export default observer(ActivityList);