const { celebrate, Joi } = require('celebrate');
const validatorLib = require('validator');
const moviesRouter = require('express').Router();

const { createMovie } = require('../controllers/movies');
const { getMovies } = require('../controllers/movies');
const { deleteMovie } = require('../controllers/movies');

const validateUrl = (value, helpers) => {
  if (validatorLib.isURL(value, { require_protocol: true })) return value;
  return helpers.error('any.invalid');
};

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailer: Joi.string().required().custom(validateUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validateUrl),
    movieId: Joi.string().hex().length(24),
  }),
}), createMovie);

moviesRouter.get('/movies', getMovies);

moviesRouter.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = moviesRouter;