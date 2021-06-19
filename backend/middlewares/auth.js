const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AuthError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    const error = new AuthError('Необходима авторизация');
    next(error);
  }

  req.user = payload;

  next();
};
