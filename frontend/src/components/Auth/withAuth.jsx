import React, { Component } from 'react';
import AuthHelperMethods from './AuthHelperMethods';

/* A higher order component is frequently written as a function that returns a class. */
export default function withAuth(AuthComponent) {
  const Auth = new AuthHelperMethods();

  return class AuthWrapped extends Component {
    state = {
      confirm: null,
      loaded: false,
    };

    /*
    In the componentDidMount,
    we would want to do a couple of important tasks
    in order to verify the current users authentication status
    prior to granting them enterance into the app.
    */
    componentDidMount() {
      const { history } = this.props;
      if (!Auth.loggedIn()) {
        history.replace('/login');
      } else {
        /* Try to get confirmation message from the Auth helper. */
        try {
          const confirm = Auth.getConfirm();
          console.log('confirmation is:', confirm);
          this.setState({
            confirm,
            loaded: true,
          });
        } catch (err) {
          /*
          Oh snap! Looks like there's an error
          so we'll print it out and log the user out for security reasons.
          */
          console.log(err);
          Auth.logout();
          history.replace('/login');
        }
      }
    }

    render() {
      const { loaded, confirm } = this.state;
      const { history } = this.props;
      if (loaded) {
        if (confirm) {
          console.log('confirmed!');
          return (
            /* component that is currently being wrapper(App.js) */
            <AuthComponent
              history={history}
              confirm={confirm}
            />
          );
        }
        console.log('not confirmed!');
        return null;
      }
      return null;
    }
  };
}
