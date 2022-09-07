const mongoose = require('mongoose');

const { Schema } = mongoose;

// Опишем схему:
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      // default: 'Вася Пупкин',
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      // default: 'Слесарь-механизатор',
    },
    avatar: {
      type: String,
      required: true,
      // default: 'https://st2.depositphotos.com/2255567/10039/v/950/depositphotos_100393528-stock-illustration-cute-crab-cartoon.jpg',
    },
  },
  { versionKey: false },
);
// где параметр управления версией документа мозолил глаз, вот и убрал...

// Предполагаю, что если понадобится добавить в схему
// емайл и пароль для регистрации и авторизации
// или проверять соответствие содержимого "avatar" на предмет URL
// будет неоходимо устанавливать пакет npm install validator
// и использовать методы проверки полей (только строки)
// согласно статье https://github.com/validatorjs/validator.js

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
