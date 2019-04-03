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
      isAuth: true
    };
  }

  async componentWillMount() {
    console.log('app componentWillMount');
    this.authWithSession();
  }
  // call fetch method with session id in cookies
  authWithSession = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    if (sessionID) {
      console.log('app auth', sessionID);
      const auth = await this.authFetchPost(sessionID);
      if (auth) {
        console.log('auth success');
        this.setState({ isAuth: true });
        this.props.history.push('/');
      } else {
        this.setState({ isAuth: false });
        this.props.history.push('/login');
        console.log('session invalid');
      }
    } else {
      this.setState({ isAuth: false });
    }
  };
  // send session id to server auth service
  authFetchPost = async sessionID => {
    // post to auth.js with cookies
    const res = await fetch(`/api/auth/${sessionID}`);
    if (res.status === 201) {
      return true;
      // this.props.history.push('/');
    } else {
      return false;
    }
  };
  render() {
    const { isAuth } = this.state;
    return (
      <React.Fragment>
        <Switch>
          <Route
            exact
            path="/login"
            render={props => (
              <Login {...props} AppAuth={this.authWithSession} />
            )}
          />
          <Route path="/signup" render={props => <Signup {...props} />} />
          <Route
            path="/"
            render={props =>
              isAuth ? <Main {...props} /> : <Redirect to="/login" />
            }
          />
        </Switch>
      </React.Fragment>
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
