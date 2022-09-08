const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/http-status-codes');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find(req);
    res.send(cards);
  } catch (err) {
    /* console.log(err); */
    res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Произошла внутренныя ошибка сервера',
    });
  }
};

const createCard = async (req, res) => {
  try {
    // записываем данные в базу
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    // возвращаем записанные в базу данные карточки
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректные данные при создании карточки',
      });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Произошла внутренныя ошибка сервера',
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (!card) {
      res.status(NOT_FOUND).send({
        message: 'Карточка с указанным _id не найдена',
      });
      return;
    }
    /* Переработаю позже в соответсвии с рекомендацией ревью
    if (card.owner.id !== req.user._id) {
      res.status(UNAUTHORIZED).send({
        message: 'Вы не можете удалять чужие карточки',
      });
      return;
    } */
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({
        message: 'Переданы некорректный _id карточки при удалении',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла внутренныя ошибка сервера',
      });
    }
  }
};

const setLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      res.status(NOT_FOUND).send({
        message: 'Карточка с указанным _id не найдена',
      });
      return;
    }
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({
        message: 'Передан некорректный _id карточки при лайке',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла внутренныя ошибка сервера',
      });
    }
  }
};

const deleteLikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      res.status(NOT_FOUND).send({
        message: 'Карточка с указанным _id не найдена',
      });
      return;
    }
    res.send(card);
  } catch (err) {
    /* console.log(err); */
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({
        message: 'Передан некорректный _id карточки при дизлайке',
      });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла внутренныя ошибка сервера',
      });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
};

// Переработать удаление карточки в соответствии с рекомендациями ревью
//
// В card.owner.id хранится объект, его нужно передать в строку,
// тогда можно сравнить с  req.user._id - это во-первых.
// А во-вторых Card.findByIdAndRemove если находит карточку,
// то сразу удаляет. Поэтому нужно сначала найти карточку findById,
// проверить owner, а потом удалить или вернуть, что доступ запрещен.
