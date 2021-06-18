require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');

const {
  portVar, mongoConfig, signupJoiObj, signinJoiObj,
} = require('./utils/utils');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { createUser, login, logout } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const SearchError = require('./errors/search-err');

const { PORT = portVar } = process.env;
const app = express();

app.use(cors({
  origin: true,
  exposedHeaders: '*',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', mongoConfig);

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({ body: signupJoiObj }), createUser);

app.post('/signin', celebrate({ body: signinJoiObj }), login);

app.post('/signout', auth, logout);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use('*', () => {
  throw new SearchError('Страницы по запрашиваемому адресу не существует');
});

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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
