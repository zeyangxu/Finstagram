import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descText: ''
    };
    this.fileInput = React.createRef();
  }
  // handle phot submit
  submitHandler = async e => {
    e.preventDefault();
    this.props.startLoader();
    // do something
    console.log(this.fileInput.current.files[0]);
    const data = new FormData();
    const { cookies } = this.props;
    const { descText } = this.state;
    const sessionID = cookies.cookies.sessionID;
    console.log('main upload', sessionID);
    data.append('active_session_id', sessionID);
    data.append('description', descText);
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
        this.props.history.push('/');
        console.log('upload fail', json.error);
      }
      window.scrollTo(0, 0);
      this.props.stopLoader();
      this.fileInput.current.value = '';
      this.setState({ descText: '' });
    } catch (err) {
      console.error(err);
    }
  };
  // desc change handler
  onDescChange = e => {
    this.setState({ descText: e.target.value });
  };
  render() {
    const { descText } = this.state;
    return (
      <div>
        <Form onSubmit={this.submitHandler}>
          <Form.TextArea
            value={descText}
            onChange={this.onDescChange}
            placeholder="what's about this photo..."
          />
          <Form.Group>
            <Form.Field>
              <input type="file" name="userpost" ref={this.fileInput} />
            </Form.Field>
          </Form.Group>
          <Button color="violet" type="submit" style={{ marginBottom: '1rem' }}>
            Upload
          </Button>
        </Form>
      </div>
    );
  }
}
Upload.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default withCookies(Upload);
