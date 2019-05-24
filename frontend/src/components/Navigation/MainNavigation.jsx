import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import AuthHelperMethods from '../Auth/AuthHelperMethods';

import './MainNavigation.css';

class MainNavigation extends Component {
  Auth = new AuthHelperMethods();

  handleLogout = () => {
    this.Auth.logout();
    window.location.reload();
  }

  render() {
    return (
      <nav className="main-navigation">
        <div className="main-navigation__logo">
          <h1>EasyEvent</h1>
        </div>
        <div className="main-navigation__items">
          <ul>
            <li>
              <NavLink to="/events">
                <i className="fas fa-stream" />
                &nbsp;Events
              </NavLink>
            </li>
            {this.Auth.loggedIn() ? (
              <React.Fragment>
                <li>
                  <NavLink to="/bookings">
                    <i className="far fa-calendar-check" />
                    &nbsp;Bookings
                  </NavLink>
                </li>
                <li>
                  <button type="button" onClick={this.handleLogout}>
                    <i className="fas fa-sign-out-alt" />
                    &nbsp;Logout
                  </button>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li>
                  <NavLink to="/login">
                    <i className="fa fa-sign-in-alt" />
                    &nbsp;Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signUp">
                    <i className="fas fa-user-plus" />
                    &nbsp;Sign up
                  </NavLink>
                </li>
              </React.Fragment>
            )
            }
          </ul>
        </div>
      </nav>
    );
  }
}

export default MainNavigation;
