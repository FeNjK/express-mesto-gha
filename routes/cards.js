const routerCard = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

routerCard.get('/cards', getCards); // возвращает все карточки
routerCard.post('/cards', createCard); // создаёт карточку
routerCard.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
routerCard.put('/cards/:cardId/likes', setLikeCard); // поставить лайк карточке
routerCard.delete('/cards/:cardId/likes', deleteLikeCard); // убрать лайк с карточки

module.exports = routerCard;
