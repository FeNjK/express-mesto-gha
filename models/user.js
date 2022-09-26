const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');

// Опишем схему:
const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validator(v) {
        /* или просто validator: (v) => isURL(v), */
        /* return validator.isURL(v); */
        // eslint-disable-next-line no-useless-escape
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/mi.isURL(v);
      },
    },
    email: {
      type: String,
      required: [true, 'Требуется ввести email'],
      validate: {
        validator(v) {
          /* или просто validator: (v) => isEmail(v), */
          return validator.isEmail(v);
          /* return //.isEmail(v); */
        },
        message: 'Неправильный формат почты',
        /* или message: props => '${props.value} - Неправильный формат почты' */
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Требуется ввести пароль'],
      select: false, // эту настройку включать только после проверки хэширования
      validate: { // или просто validator: (v) => isStrongPassword(v),
        validator(v) {
          return validator.isStrongPassword(v);
        },
        message: 'Ваш пароль не удовлетворяет требования безопасности',
      },
    },
  },
  { versionKey: false },
);
// параметр управления версией документа мозолил глаз, вот и убрал...

// Чтобы при POST-запросе при логине сервер
// нам не отправлял пароль вместе с остальными данными о пользователе
userSchema.methods.toJSON = function delUserPassword() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);

// https://github.com/validatorjs/validator.js
// https://github.com/matteodelabre/mongoose-beautiful-unique-validation
// https://www.npmjs.com/package/mongoose-schema-validator
// https://docs.microsoft.com/en-us/dotnet/standard/base-types/how-to-verify-that-strings-are-in-valid-email-format?redirectedfrom=MSDN
