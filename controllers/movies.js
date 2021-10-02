const BadRequestError = require('./errors/bad-request-err');
const Movie = require('../models/movie');
const NotFoundError = require('./errors/not-found-err');
const ForbiddenError = require('./errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Вы не можете удалить фильм другого пользователя');
      }
      return movie.remove()
        .then(() => res.send({}));
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