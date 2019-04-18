import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Button,
  Form,
  Header,
  Message,
  Icon
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isValidInput: false,
      showWarningMsg: false,
      err_msg: '' // empty input or unauthorized
    };
  }
  // validate user input when click submit
  validate = () => {
    const { username, password } = this.state;
    let isValid = true;
    if ((username.length === 0) | (password.length === 0)) {
      isValid = false;
      this.setState({ err_msg: 'All filed must be filled' });
    }
    return isValid;
  };
  // send user input to server authentication system
  postAuth = async () => {
    const { username, password } = this.state;
    const { cookies, AppAuth } = this.props;

    // first check if the user input is valid
    if (this.validate()) {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const json = await res.json();
        if (res.status === 201) {
          cookies.set('sessionID', json.session, { maxAge: 5000 });
          await AppAuth();
          this.props.history.push('/');
        } else {
          const error_map = {
            NO_USER: 'user name does not exist',
            WRONG_PASS: 'pass word is incorrect'
          };
          this.setState({
            err_msg: error_map[json.error],
            showWarningMsg: true
          });
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // show error message
      this.setState({ showWarningMsg: true });
    }
  };
  // input validation
  handleInput = e => {
    const target = e.target;
    const name = target.name;
    this.setState({ [name]: target.value });
  };

  render() {
    const { username, password, showWarningMsg, err_msg } = this.state;
    return (
      <div>
        <Grid centered columns={3} style={{ paddingTop: '5rem' }}>
          <Grid.Column>
            <Segment raised>
              <Header
                as="h1"
                textAlign="center"
                size="huge"
                style={{
                  fontFamily: "'Pacifico', cursive",
                  fontSize: '50px',
                  color: '#ba68c8',
                  marginTop: '1rem',
                  marginBottom: '3rem'
                }}
              >
                Finstagram
              </Header>

              <Form onSubmit={this.postAuth}>
                <Form.Field>
                  <label>User name</label>
                  <input
                    placeholder="abc123"
                    value={username}
                    name="username"
                    onChange={this.handleInput}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input
                    value={password}
                    name="password"
                    type="password"
                    onChange={this.handleInput}
                  />
                </Form.Field>
                <Form.Field>
                  don't have an account?
                  <Link to="/signup"> sign up</Link>
                </Form.Field>
                <Button color="blue" fluid type="submit">
                  Sign in
                </Button>
              </Form>
            </Segment>
            {showWarningMsg ? (
              <Message error attached="bottom">
                <Icon name="warning" />
                {err_msg}
              </Message>
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
Login.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired
};
export default compose(
  withCookies,
  withRouter
)(Login);
