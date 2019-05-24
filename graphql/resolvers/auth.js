const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async ({ userInput }) => {
    try {
      const user = await User.findOne({ email: userInput.email });
      if (user) {
        throw new Error('User exists already');
      }
      const password = await bcrypt.hash(userInput.password, 12);
      const newUser = new User({
        email: userInput.email,
        password,
      });
      const result = await newUser.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Please input valid email and password');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Please input valid email and password');
      }
      const token = jwt.sign(
        { userId: user.id },
        process.env.PRIVATE_KEY,
        { expiresIn: '1h' },
      );
      return { token };
    } catch (error) {
      throw error;
    }
  },
};
