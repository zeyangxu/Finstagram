import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Login from './Login';
import Main from './Main';
import Gallery from './Gallery';
import Signup from './Signup';
import OtherUser from './OtherUser';
import ScrollToTop from './ScrollToTop';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: true,
      username: null
    };
  }

  componentWillMount() {
    this.authWithSession();
  }
  // call authFetchPost() with session id in cookies
  authWithSession = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    if (sessionID) {
      try {
        const auth = await this.authFetchPost(sessionID);
        if (auth) {
          this.setState({ isAuth: true });
          this.props.history.push('/');
        } else {
          this.setState({ isAuth: false });
          this.props.history.push('/login');
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
    try {
      const res = await fetch(`/api/auth/${sessionID}`);
      const json = await res.json();
      if (res.status === 201) {
        this.setState({ username: json.username });
        return true;
        // this.props.history.push('/');
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
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
          <ScrollToTop>
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
                  <Main {...props} username={username} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              path="/gallery"
              render={props =>
                isAuth ? (
                  <Gallery {...props} username={username} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              path="/user/:username"
              render={props => <OtherUser {...props} username={username} />}
            />
          </ScrollToTop>
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
