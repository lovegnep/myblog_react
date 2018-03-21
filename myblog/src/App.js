import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import home from "./pages/home/home";
import login from './pages/login/login';

class App extends Component {
render(){
    return(
      <Router>
        <Switch>
          <Route path="/" exact component={home} />
          <Route path="/login" component={login} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

export default App;
