import React from 'react';
import { Grid } from 'semantic-ui-react';
import Collection from './Collection';

export default function CollectionList({ photoList, onDeleteBtnClick }) {
  return (
    <div>
      <Grid>
        <Grid.Row columns={3}>
          {photoList &&
            photoList.map(i => (
              <Grid.Column key={i.photoID}>
                <Collection
                  img_url={'http://localhost:5000' + i.filePath}
                  key={i.photoID}
                  photoID={i.photoID}
                  owner_name={i.username}
                  date={i.timestamp}
                  isPublic={i.isPublic}
                  description={i.caption}
                  deleteHandler={onDeleteBtnClick}
                  showDelete={true}
                  centered={false}
                  fluid={false}
                />
              </Grid.Column>
            ))}
        </Grid.Row>
      </Grid>
    </div>
  );
}
