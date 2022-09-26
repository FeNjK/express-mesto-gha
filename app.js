require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/http-status-codes');
const { validURL } = require('./utils/regularExpressions');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
// удалить краш-тест после успешного прохождения ревью
app.get('/crash-test', () => { // краш-тест сервера
  // принудительное падение сервера для проверки его перезапуска pm2
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(validURL),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/', routerUser);
app.use('/', routerCard);
app.use('*', () => {
  throw new NotFoundError('Ресурс не найден.');
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // наш централизованный обработчик

async function runServer() {
  try {
    // Подключаемся к серверу
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      // согласно документации по адресу
      // https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
      // всё что тут раньше было представлено устарело в 6 версии Mongoose. У меня 6-я.
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Подключение к серверу успешно установлено');

    // прозваниваем порт
    await app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  } catch (err) {
    console.log('Возникла ошибка в подключении к серверу');
    console.log(err);
  }
}

runServer();
