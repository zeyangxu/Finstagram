import React, { Component } from 'react';
import { Form, Button, Radio } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descText: '',
      isPublicPost: '1'
    };
  }
  // handle phot submit
  submitHandler = async e => {
    e.preventDefault();
    this.props.startLoader();
    // do something
    const data = new FormData();
    const { cookies } = this.props;
    const { descText, isPublicPost } = this.state;
    const sessionID = cookies.cookies.sessionID;
    data.append('active_session_id', sessionID);
    data.append('description', descText);
    data.append('isPublic', isPublicPost);
    data.append('userpost', this.props.fileInputRef.current.files[0]);
    // data.append('filename', this.fileName.value);
    try {
      const res = await fetch('/api/upload/photo', {
        method: 'POST',
        body: data
      });
      const json = await res.json();
      if (res.status === 200) {
        this.props.closeModal();
        console.log('upload success');
      } else {
        alert(json.error);
        console.error('upload fail', json.error);
      }
      window.scrollTo(0, 0);
      this.props.stopLoader();
      // this.props.fileInputRef.current.value = '';
      // this.setState({ descText: '' });
    } catch (err) {
      this.props.stopLoader();
      console.error(err);
    }
  };
  // desc change handler
  onDescChange = e => {
    this.setState({ descText: e.target.value });
  };
  onVisibilityChange = (e, { value }) => {
    this.setState({ isPublicPost: value });
  };
  render() {
    const { descText, isPublicPost } = this.state;
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
              <input
                type="file"
                name="userpost"
                ref={this.props.fileInputRef}
                onChange={this.props.fileInputOnChange}
              />
            </Form.Field>
            <Button
              color="violet"
              type="submit"
              style={{ marginBottom: '1rem' }}
            >
              Upload
            </Button>
          </Form.Group>
          <Form.Group>
            <label>Visibility</label>
            <Form.Radio
              label="public"
              value="1"
              checked={isPublicPost === '1'}
              control={Radio}
              onChange={this.onVisibilityChange}
            />
            <Form.Radio
              label="privite"
              value="0"
              checked={isPublicPost === '0'}
              control={Radio}
              onChange={this.onVisibilityChange}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }
}
Upload.protoTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};
export default compose(
  withCookies,
  withRouter
)(Upload);
