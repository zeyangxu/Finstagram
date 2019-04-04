import React, { Component } from 'react';
import Navbar from './Navbar';
import FeedList from './FeedList';
import Upload from './Upload';
import { Dimmer, Loader, Container } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';

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
        <Navbar />
        <Container>
          <Dimmer active={loading}>
            <Loader>Loading</Loader>
          </Dimmer>
          <Upload startLoader={this.startLoader} stopLoader={this.stopLoader} />
          <FeedList
            loading={loading}
            startLoader={this.startLoader}
            stopLoader={this.stopLoader}
          />
        </Container>
      </div>
    );
  }
}
Main.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(Main);
