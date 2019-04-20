import React, { Component } from 'react';
import { Grid, Dimmer, Loader, Container } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import PhotoList from './PhotoList';
import Users from './UserSeg';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoList: [],
      loading: false
    };
  }

  startLoader = () => {
    console.log('startLoader()');
    this.setState({ loading: true });
  };
  stopLoader = () => {
    console.log('stopLoader()');
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Navbar username={this.props.username} />
        <Container style={{ marginTop: '2rem' }}>
          <Dimmer active={loading}>
            <Loader>Loading</Loader>
          </Dimmer>

          <Grid>
            <Grid.Column width={11}>
              <PhotoList
                fetchType="main"
                loading={loading}
                startLoader={this.startLoader}
                stopLoader={this.stopLoader}
              />
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Users />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}
Main.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(Main);
