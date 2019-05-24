import React from 'react';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

const App = () => (
  <BrowserRouter>
    <MainNavigation />
    <main className="main-content">
      <Switch>
        <Redirect from="/" to="/events" exact />
        <Route path="/login" component={LoginPage} />
        <Route path="/signUp" component={SignUpPage} />
        <Route path="/events" component={EventsPage} />
      </Switch>
    </main>
  </BrowserRouter>
);

export default App;
