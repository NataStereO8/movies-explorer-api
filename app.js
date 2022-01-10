const express = require('express');
const helmet = require("helmet");
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const mongoURL = NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb';

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(helmet());

require('dotenv').config();

const allowedCors = [
  'http://cinemaholic.nomoredomains.work',
  'http://api.cinemaholic.nomoredomains.work',
  'https://cinemaholic.nomoredomains.work',
  'https://api.cinemaholic.nomoredomains.work',
  'http://localhost:3001',
  'http://localhost:3000',
  'https://84.201.147.130',
  'http://84.201.147.130',
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

app.use(errorHandler);

app.listen(PORT, () => { });
