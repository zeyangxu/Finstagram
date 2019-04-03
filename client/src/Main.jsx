import React, { Component } from 'react';
import Navbar from './Navbar';
import FeedList from './FeedList';
import { Button } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';

class Main extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }
  submitHandler = async e => {
    e.preventDefault();
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
        alert(json.error);
        console.log('upload fail', json.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <form onSubmit={this.submitHandler}>
          <input type="file" name="userpost" ref={this.fileInput} />
          <Button color="violet" type="submit" style={{ marginBottom: '1rem' }}>
            Upload
          </Button>
        </form>
        <FeedList />
      </div>
    );
  }
}
Main.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(Main);
