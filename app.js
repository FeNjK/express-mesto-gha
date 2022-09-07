const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { DB_URL, DB_OPTIONS } = require('./utils/connection-settings');
const { NOT_FOUND } = require('./utils/http-status-codes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6317a1ec12fa03b5bc205764', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', routerUser);
app.use('/', routerCard);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ресурс не найден' });
});

async function runServer() {
  try {
    // Подключаемся к серверу
    await mongoose.connect(DB_URL, DB_OPTIONS);
    // взаимодействие с базой данных
  } catch (err) {
    console.log(err);
  } finally {
    // Закрываем подключение при завершении работы или при ошибке
    await mongoose.close();
  }
}
runServer();

/* mongoose.connect(DB_URL, DB_OPTIONS);
// или через MongoClient ?! */

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
