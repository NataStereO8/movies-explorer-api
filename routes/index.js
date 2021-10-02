const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../controllers/errors/not-found-err');
const indexRouter = require('express').Router();

const { login } = require('../controllers/users');
const { createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const moviesRouter = require('./movies');
const usersRouter = require('./users');

indexRouter.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }), login);

  indexRouter.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30).required(),
    }),
}), createUser);

indexRouter.use(auth);

indexRouter.use('/', moviesRouter);
indexRouter.use('/', usersRouter);

indexRouter.all('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = indexRouter;