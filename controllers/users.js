const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const ConflictError = require('./errors/conflict-err');
const User = require('../models/user');
const BadRequestError = require('./errors/bad-request-err');
const NotFoundError = require('./errors/not-found-err');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).then((userFound) => {
    if (userFound) throw new ConflictError('Пользователь с таким e-mail уже существует');
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          const userToSend = user.toObject();
          delete userToSend.password;
          res.send({ data: userToSend });
        });
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      return new BadRequestError(err.message);
    }
    return next(err);
  });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неправильно указан ID'));
      }
      if (err.message === 'Элемент" по указанному ID не найден.') {
        return next(new NotFoundError('Элемент" по указанному ID не найден.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: req.body.name, email: req.body.email } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};
