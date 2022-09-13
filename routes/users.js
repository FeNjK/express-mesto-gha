const routerUser = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

// const { joiIdValidation } = require('../utils/joiValidationFuction');
// Почему-то при обработке валидации таким способом ощибки только множатся...

const {
  getUsers,
  getUserMe,
  getUserById,
  editUserData,
  editUserAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers); // возвращает всех пользователей
routerUser.get(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      userId: Joi.string().required()
        .custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.err('Запрашиваемый id некорректен');
          }
          return value;
        }),
      // userId: Joi.string().required().custom(joiIdValidation),
    }),
  }),
  getUserMe,
); // возвращает информацию о текущем пользователе

routerUser.get(
  '/users/:userId',
  celebrate({
    body: Joi.object().keys({
      userId: Joi.string().required()
        .custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.err('Запрашиваемый id некорректен');
          }
          return value;
        }),
      // userId: Joi.string().required().custom(joiIdValidation),
    }),
  }),
  getUserById,
); // возвращает пользователя по _id

routerUser.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  editUserData,
); // обновляет профиль

routerUser.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required()
        // eslint-disable-next-line no-useless-escape
        .regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/mi),
    }),
  }),
  editUserAvatar,
); // обновляет аватар

module.exports = routerUser;
