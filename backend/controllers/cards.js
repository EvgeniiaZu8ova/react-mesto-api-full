const Card = require('../models/card');

const { messages } = require('../utils/utils');

const {
  cardCreate, cardSearch, cardLike, cardDelete,
} = messages;

const SearchError = require('../errors/search-err');
const DataError = require('../errors/data-err');
const RightsError = require('../errors/rights-err');

async function getCards(req, res, next) {
  let cards;

  try {
    cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(e);
  }
}

// eslint-disable-next-line consistent-return
async function deleteCard(req, res, next) {
  const id = req.params.cardId;
  const currentUserId = req.user._id;
  let card;
  let cardData;

  try {
    card = await Card.findById(id);

    if (!card) {
      throw new SearchError(cardSearch);
    }

    const { owner } = card;

    if (!owner.equals(currentUserId)) {
      throw new RightsError(cardDelete);
    }

    try {
      cardData = await Card.deleteOne({ _id: id });

      if (!cardData) {
        return Promise.reject(new Error('Не удалось удалить карточку'));
      }

      return res.send({ data: cardData });
    } catch (e) {
      next(e);
    }
  } catch (e) {
    if (e.name === 'CastError') {
      const error = new SearchError(cardSearch);
      next(error);
    }
    next(e);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user;
  let card;

  try {
    card = await Card.create({ name, link, owner });
    res.status(201).send({ data: card });
  } catch (e) {
    if (e.name === 'ValidationError') {
      const error = new DataError(cardCreate);
      next(error);
    }
    next(e);
  }
}

async function likeCard(req, res, next) {
  const id = req.params.cardId;
  let card;

  try {
    card = await Card.findByIdAndUpdate(id,
      { $addToSet: { likes: req.user._id } }, { new: true });

    if (!card) {
      throw new SearchError(cardSearch);
    }

    res.send({ data: card });
  } catch (e) {
    if (e.name === 'CastError') {
      const error = new DataError(cardLike);
      next(error);
    }
    next(e);
  }
}

async function dislikeCard(req, res, next) {
  const id = req.params.cardId;
  let card;

  try {
    card = await Card.findByIdAndUpdate(id,
      { $pull: { likes: req.user._id } }, { new: true });

    if (!card) {
      throw new SearchError(cardSearch);
    }

    res.send({ data: card });
  } catch (e) {
    if (e.name === 'CastError') {
      const error = new DataError(cardLike);
      next(error);
    }
    next(e);
  }
}

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
