import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import Feed from './Feed';

export default class FeedList extends Component {
  render() {
    const data = {
      img_url: 'https://picsum.photos/1200',
      owner_name: 'zeb',
      date: 'xx-xx',
      description: 'hello'
    };
    return (
      <div>
        <Grid centered>
          <Grid.Column width={9}>
            <Feed {...data} />
            <Feed {...data} />
            <Feed {...data} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
