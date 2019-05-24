import decode from 'jwt-decode';
import { get } from 'lodash';

export default class AuthHelperMethods {
  login = (email, password) => {
    const requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };
    // Get a token from api server using the fetch api
    return this.fetch({
      body: JSON.stringify(requestBody),
    }).then((res) => {
      this.setToken(res.data.login.token); // Setting the token in localStorage
      return Promise.resolve(true);
    }).catch((error) => {
      throw error;
    });
  };

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  };

  userId = () => {
    if (!this.loggedIn()) {
      return null;
    }
    return decode(this.getToken()).userId; // handwaiving here
  };

  isTokenExpired = (token) => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired.
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.log('expired check failed! Line 42: AuthService.js');
      return false;
    }
  };

  setToken = (token) => {
    // Saves user token to localStorage
    localStorage.setItem('token', token);
  };

  // Retrieves the user token from localStorage
  getToken = () => localStorage.getItem('token');

  // Clear user token and profile data from localStorage
  logout = () => localStorage.removeItem('token');

  // Using jwt-decode npm package to decode the token
  getConfirm = () => decode(this.getToken());

  fetch = (options, url = 'http://localhost:8000/graphql') => {
    // performs api calls sending the required authentication headers
    const headers = {
      'Content-Type': 'application/json',
    };
    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    return fetch(url, {
      headers,
      method: 'POST',
      ...options,
    })
      .then(this.checkStatus)
      .then(response => response.json())
      .then((response) => {
        const errorMsg = get(response, 'errors[0].message');
        if (errorMsg) {
          throw new Error(errorMsg);
        }
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };

  checkStatus = (response) => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    }
    const error = new Error(response.error);
    error.response = response;
    throw error;
  };
}
