import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import home from "./pages/home/home";
import login from './pages/login/login';
import theme from './pages/blog/theme';
import NewTheme from './pages/blog/new';
import Tmpnew from './pages/blog/tmpnew';
import EditTheme from './pages/blog/edit';
class App extends Component {
render(){
    return(
      <Router>
        <Switch>
          <Route path="/" exact component={home} />
          <Route path="/login" component={login} />
          <Route path="/theme/:id" component={theme} />
          <Route path="/newtheme" component={Tmpnew} />
          <Route path="/tmpnew" component={NewTheme} />
          <Route path="/edittheme" component={EditTheme} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

export default App;
