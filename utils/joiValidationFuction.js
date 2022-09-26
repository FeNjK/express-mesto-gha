const mongoose = require('mongoose');
const { BadRequestError } = require('../errors/http-status-codes');

const joiIdValidation = (value) => {
  const isValid = mongoose.isObjectIdOrHexString(value);
  // isObjectIdOrHexString() возвращает true только для ObjectId экземпляров
  // или 24-символьных шестнадцатеричных строк и возвращает false для чисел,
  // документов и строк длиной 12.
  // https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-isValidObjectId

  if (!isValid) {
    throw new BadRequestError('Переданный _id некорректен.');
  }
  return value;
};

module.exports = { joiIdValidation };
