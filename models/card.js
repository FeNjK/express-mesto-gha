const mongoose = require('mongoose');

const { Schema } = mongoose;

// Опишем схему:
const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/mi.isURL(v);
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user', // сделали ссылку на другую схему через строку
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user', // сделали ссылку на другую схему через строку
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

// Предполагаю, что если понадобится проверять
// соответствие содержимого "link" на предмет URL, то
// будет неоходимо устанавливать пакет npm install validator
// и использовать методы проверки полей (только строки)
// согласно статье https://github.com/validatorjs/validator.js

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
