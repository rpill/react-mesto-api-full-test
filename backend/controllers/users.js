const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

const ConflictError = require('../errors/conflict-error');

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // Студенты могут записывать jwt в куку, либо же отправлять в теле ответа. Оба варианта - ок
      res
        // .cookie('jwt', token, {
        //   // jwt токен выпускается на определённый срок (например, 7 дней), а не даётся бессрочно
        //   maxAge: 3600000,
        //   httpOnly: true,
        //   sameSite: true,
        // })
        .send({ data: user.toJSON(), token });
    })
    .catch(next);
};

// POST /signup
const createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.status(201).send({ data: data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else {
        next(err);
      }
    });
};

// GET /users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserData = (id, res, next) => {
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь по заданному id отсутствует в базе'))
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// GET /users/:userId
const getUser = (req, res, next) => {
  getUserData(req.params.id, res, next);
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  getUserData(req.user._id, res, next);
};

const updateUserData = (res, req, next) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь по заданному id отсутствует в базе'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// PATCH /users/me
const updateUserInfo = (req, res, next) => updateUserData(res, req, next);

// PATCH /users/me/avatar
const updateUserAvatar = (req, res, next) => updateUserData(res, req, next);

module.exports = {
  login,
  updateUserInfo,
  updateUserAvatar,
  createUser,
  getUsers,
  getUser,
  getCurrentUser,
};
