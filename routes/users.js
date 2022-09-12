const routerUser = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const {
  getUsers,
  getUserById,
  editUserData,
  editUserAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers); // возвращает всех пользователей

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
        .regex(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/gmi),
    }),
  }),
  editUserAvatar,
); // обновляет аватар

module.exports = routerUser;
