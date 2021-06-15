const cardRouter = require('express').Router();
const { celebrate } = require('celebrate');

const { findCardJoiObj, createCardJoiObj } = require('../utils/utils');

const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', celebrate({ params: findCardJoiObj }), deleteCard);

cardRouter.post('/', celebrate({ body: createCardJoiObj }), createCard);

cardRouter.put('/:cardId/likes', celebrate({ params: findCardJoiObj }), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({ params: findCardJoiObj }), dislikeCard);

module.exports = cardRouter;
