const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const [, token] = authHeader.split(' '); // Bearer xxxxx
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
  } catch (error) {
    req.isAuth = false;
    return next();
  }
};
