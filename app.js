require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { NOT_FOUND } = require('./errors/http-status-codes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', routerUser);
app.use('/', routerCard);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ресурс не найден' });
});

app.use(errorHandler);

async function runServer() {
  try {
    // Подключаемся к серверу
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      // согласно документации по адресу
      // https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
      // всё что тут раньше было представлено устарело в 6 версии Mongoose. У меня 6-я.
      serverSelectionTimeoutMS: 5000, // целесообразно ли ?!.
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
