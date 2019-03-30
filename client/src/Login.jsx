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
import { Link } from 'react-router-dom';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isValidInput: false,
      showWarningMsg: false,
      err_msg: ''
    };
  }
  validate = () => {
    const { username, password } = this.state;
    let isValid = true;
    if ((username.length === 0) | (password.length === 0)) {
      isValid = false;
      this.setState({ err_msg: 'All filed must be filled' });
    }
    return isValid;
  };

  postAuth = async () => {
    const { username, password } = this.state;

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
        console.log(err);
      }
    } else {
      // show error message
      this.setState({ showWarningMsg: true });
    }
  };
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
