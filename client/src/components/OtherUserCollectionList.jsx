import React from 'react';
import { Grid } from 'semantic-ui-react';
import Feed from './Feed';

export default function OtherUserCollectionList({
  photoList,
  onDeleteBtnClick
}) {
  return (
    <div>
      <Grid>
        <Grid.Row columns={3}>
          {photoList &&
            photoList.map(i => (
              <Grid.Column key={i.photoID}>
                <Feed
                  img_url={'http://localhost:5000' + i.filePath}
                  key={i.photoID}
                  {...i}
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
