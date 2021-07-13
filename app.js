const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(helmet());

require('dotenv').config();

const allowedCors = [
  'http://wabu-labu-dab-dab.nomoredomains.icu',
  'http://api.wabu-labu-dab-dab.nomoredomains.icu',
  'https://wabu-labu-dab-dab.nomoredomains.icu',
  'https://api.wabu-labu-dab-dab.nomoredomains.icu',
  'http://localhost:3001',
  'https://130.193.46.121',
  'http://130.193.46.121',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  }

  next();
});

app.options('/*', (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.send();
  } else next();
});

app.use(express.json());

app.use(requestLogger);

app.use('/', indexRouter);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => { });