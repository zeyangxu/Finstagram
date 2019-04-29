import React from 'react';
import { Grid } from 'semantic-ui-react';
import Collection from './Collection';

export default function CollectionList({
  photoList,
  onDeleteBtnClick,
  rerender
}) {
  return (
    <div>
      <Grid>
        <Grid.Row columns={3}>
          {photoList &&
            photoList.map(i => (
              <Grid.Column key={i.photoID}>
                <Collection
                  img_url={'http://localhost:5000/' + i.filePath}
                  key={i.photoID}
                  {...i}
                  deleteHandler={onDeleteBtnClick}
                  showDelete={true}
                  centered={false}
                  fluid={false}
                  rerender={rerender}
                />
              </Grid.Column>
            ))}
        </Grid.Row>
      </Grid>
    </div>
  );
}
