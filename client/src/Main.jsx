import React, { Component } from 'react';
import Navbar from './Navbar';
import FeedList from './FeedList';
import { Button, Dimmer, Loader, Container } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoList: [],
      loading: false
    };
    this.fileInput = React.createRef();
  }

  startLoader = () => {
    console.log('startLoader()');
    this.setState({ loading: true });
  };
  stopLoader = () => {
    console.log('stopLoader()');
    this.setState({ loading: false });
  };
  // handle phot submit
  submitHandler = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    // do something
    console.log(this.fileInput.current.files[0]);
    const data = new FormData();
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    console.log('main upload', sessionID);
    data.append('active_session_id', sessionID);
    data.append('userpost', this.fileInput.current.files[0]);
    // data.append('filename', this.fileName.value);
    try {
      const res = await fetch('/api/upload/photo', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (res.status === 200) {
        console.log('upload success');
      } else {
        console.log('upload fail', json.error);
      }
      this.setState({ loading: false });
      this.fileInput.current.value = '';
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        {loading && (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
        <Navbar />
        <Container>
          <form onSubmit={this.submitHandler}>
            <input type="file" name="userpost" ref={this.fileInput} />
            <Button
              color="violet"
              type="submit"
              style={{ marginBottom: '1rem' }}
            >
              Upload
            </Button>
          </form>
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
