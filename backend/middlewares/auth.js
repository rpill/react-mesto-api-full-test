const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/unauthorized-error');

// есть файл middlewares/auth.js, в нём мидлвэр для проверки JWT;
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
