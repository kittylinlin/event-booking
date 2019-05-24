import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isEmail } from 'validator';
import { isEmpty } from 'lodash';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthHelperMethods from '../components/Auth/AuthHelperMethods';

import './Auth.css';

class LoginPage extends Component {
  Auth = new AuthHelperMethods();

  state = {
    alert: false,
    message: '',
  }

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  componentWillMount() {
    const { history } = this.props;
    /* Here is a great place to redirect someone who is already logged in to the protected route */
    if (this.Auth.loggedIn()) {
      history.replace('/events');
    }
  }

  closeAlert = () => {
    this.setState({ alert: false });
  }

  submitHandler = (event) => {
    const { history } = this.props;
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (!isEmail(email) || isEmpty(password.trim())) {
      this.setState({
        alert: true,
        message: 'Please input email and password!',
      });
      return;
    }

    this.Auth.login(email, password)
      .then(() => {
        history.replace('/');
        window.location.reload();
      })
      .catch((err) => {
        this.setState({
          alert: true,
          message: err.message,
        });
      });
  }

  render() {
    const { alert, message } = this.state;
    return (
      <React.Fragment>
        {alert && <Backdrop />}
        {alert && (
          <Modal
            title=""
            canConfirm
            onConfirm={this.closeAlert}
            confirmText="OK"
          >
            <h1>{message}</h1>
          </Modal>
        )}
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor="email">
              E-Mail
              <input type="email" id="email" ref={this.emailEl} />
            </label>
          </div>
          <div className="form-control">
            <label htmlFor="password">
              Password
              <input type="password" id="password" ref={this.passwordEl} />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit">
              <i className="fa fa-sign-in-alt" />
              &nbsp;Login
            </button>
            <Link to="/signUp">
              Don&apos;t have an account?
              <span> Signup</span>
            </Link>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default LoginPage;
