const Card = require('../models/card');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/http-status-codes');

const getCards = (req, res) => {
  Card.find(req)
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(NOT_FOUND)
        .send({ message: 'В базе данных отсутствуют данные о карточках' });
    });
};

const createCard = (req, res) => {
  // записываем данные в базу
  const { name, link } = req.body;
  const owner = req.user._id;

  console.log(req.user._id);

  Card.create({ name, link, owner })
    // возвращаем записанные в базу данные карточки
    .then((card) => {
      res.send({ data: card });
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      /* console.log(req.params.cardId)
      console.log(req.user._id)
      console.log(req.user) */

      if (!card) {
        res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
        /* .then((card) => {
            // не знаю пока сработает ли, проверить же не могу
            // так и не разобрался пока что с чем сравнивать...
            if (card.owner.toString() !== req.user._id) {
              res.status(UNAUTHORIZED).send({
                message: "Вы не можете удалять чужие карточки",
              });
            }
          }); */
      } else {
        res.status(OK).send(
          { data: card } && {
            message: 'Удаление карточки успешно заверщено',
          },
        );
      }
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректный _id карточки при удалении',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

const setLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
      } else {
        res.status(OK).send(
          { data: card } && {
            message: 'Вы поставили лайк карточке',
          },
        );
      }
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректный _id карточки при лайке',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
      } else {
        res.status(OK).send(
          { data: card } && {
            message: 'Вы убрали лайк с карточки',
          },
        );
      }
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректный _id карточки при дизлайке',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: 'Произошла внутренныя ошибка сервера',
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
};
