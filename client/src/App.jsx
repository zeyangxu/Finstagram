import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Main from './Main';
import Signup from './Signup';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: true,
      username: null
    };
  }

  componentWillMount() {
    console.log('app componentWillMount');
    this.authWithSession();
  }
  // call fetch method with session id in cookies
  authWithSession = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    if (sessionID) {
      console.log('app auth', sessionID);
      try {
        const auth = await this.authFetchPost(sessionID);
        if (auth) {
          console.log('auth success');
          this.setState({ isAuth: true });
        } else {
          this.setState({ isAuth: false });
          this.props.history.push('/login');
          console.log('session invalid');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      this.setState({ isAuth: false });
    }
  };
  // send session id to server auth service
  authFetchPost = async sessionID => {
    // post to auth.js with cookies
    const res = await fetch(`/api/auth/${sessionID}`);
    const json = await res.json();
    if (res.status === 201) {
      console.log('username', json.username);
      this.setState({ username: json.username });
      return true;
      // this.props.history.push('/');
    } else {
      return false;
    }
  };

  deactivateSession = () => {
    this.setState({ isAuth: false });
  };
  render() {
    const { isAuth, username } = this.state;
    return (
      <>
        <Switch>
          <Route
            path="/login"
            render={props => (
              <Login {...props} AppAuth={this.authWithSession} />
            )}
          />
          <Route
            path="/signup"
            render={props => (
              <Signup {...props} AppAuth={this.authWithSession} />
            )}
          />
          <Route
            path="/"
            exact
            render={props =>
              isAuth ? (
                <Main {...props} username={username} public={true} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
          <Route
            path="/gallery"
            render={props =>
              isAuth ? (
                <Main {...props} username={username} public={false} />
              ) : (
                <Redirect to="/login" />
              )
            }
          />
        </Switch>
      </>
    );
  }
}
App.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired
};
export default compose(
  withCookies,
  withRouter
)(App);
