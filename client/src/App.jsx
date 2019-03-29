import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login';
import Main from './Main';
import Signup from './Signup';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route path="/signup" render={props => <Signup {...props} />} />
          <Route path="/" render={props => <Main {...props} />} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
