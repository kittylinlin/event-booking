import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isEmail } from 'validator';
import { isEmpty } from 'lodash';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthHelperMethods from '../components/Auth/AuthHelperMethods';

import './Auth.css';

class SignUpPage extends Component {
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

  componentDidMount() {
    const { history } = this.props;
    if (this.Auth.loggedIn()) {
      history.push('/events');
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

    const requestBody = {
      query: `
        mutation CreateUser($email: String!, $password: String!) {
          createUser(userInput: { email: $email, password: $password }) {
            _id
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    this.Auth.fetch({
      body: JSON.stringify(requestBody),
    })
      .then(() => {
        history.replace('/login');
      })
      .catch((error) => {
        this.setState({
          alert: true,
          message: error.message,
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
              <i className="fas fa-user-plus" />
              &nbsp;Sign Up
            </button>
            <Link to="/login">
              Already have an account?
              <span> Login</span>
            </Link>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default SignUpPage;
