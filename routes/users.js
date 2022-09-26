const routerUser = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { validURL } = require('../utils/regularExpressions');
const { joiIdValidation } = require('../utils/joiValidationFuction');

const {
  getUsers,
  getUserMe,
  getUserById,
  editUserData,
  editUserAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers); // возвращает всех пользователей
routerUser.get('/users/me', getUserMe); // возвращает информацию о текущем пользователе

routerUser.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().custom(joiIdValidation),
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
      avatar: Joi.string().required().regex(validURL),
    }),
  }),
  editUserAvatar,
); // обновляет аватар

module.exports = routerUser;
