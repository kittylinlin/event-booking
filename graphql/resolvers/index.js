const eventResolver = require('./events');
const bookingResolver = require('./booking');
const authResolver = require('./auth');

module.exports = {
  ...eventResolver,
  ...bookingResolver,
  ...authResolver,
};
