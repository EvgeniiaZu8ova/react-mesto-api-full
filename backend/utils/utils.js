const { Joi } = require('celebrate');

const messages = {
  userCreate: 'Переданы некорректные данные при создании пользователя.',
  userSearch: 'Пользователь по указанному _id не найден.',
  userUpdate: 'Переданы некорректные данные при обновлении профиля.',
  userAuth: 'Ошибка при авторизации пользователя.',
  userReg: 'Такой пользователь уже существует.',
  avatarUpdate: 'Переданы некорректные данные при обновлении аватара.',
  cardCreate: 'Переданы некорректные данные при создании карточки.',
  cardSearch: 'Карточка с указанным _id не найдена.',
  cardLike: 'Переданы некорректные данные для постановки/снятии лайка.',
  cardDelete: 'Вы не можете удалять чужие карточки.',
};

const portVar = 3000;

const mongoConfig = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const handleFinalErrors = (err, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

// eslint-disable-next-line no-useless-escape
const linkRegex = /https?:\/\/(www\.)?([\w\-]{1,}\.)([\w\.~:\/\?#\[\]@!\$&'\(\)\*\+,;=\-]{2,})#?/;

const signupJoiObj = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string(),
});

const signinJoiObj = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

const findUserJoiObj = Joi.object().keys({
  userId: Joi.string().length(24).hex(),
});

const updateUserJoiObj = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(30),
});

const updateAvatarJoiObj = Joi.object().keys({
  avatar: Joi.string().required().pattern(linkRegex),
});

const findCardJoiObj = Joi.object().keys({
  cardId: Joi.string().length(24).hex(),
});

const createCardJoiObj = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  link: Joi.string().required().pattern(linkRegex),
});

module.exports = {
  messages,
  portVar,
  mongoConfig,
  handleFinalErrors,
  linkRegex,
  signupJoiObj,
  signinJoiObj,
  findUserJoiObj,
  updateUserJoiObj,
  updateAvatarJoiObj,
  findCardJoiObj,
  createCardJoiObj,
};
