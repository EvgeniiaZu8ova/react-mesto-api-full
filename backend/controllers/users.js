const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const SearchError = require('../errors/search-err');
const DataError = require('../errors/data-err');
const AuthError = require('../errors/auth-err');
const RegisterError = require('../errors/register-err');

const { messages } = require('../utils/utils');

const {
  userCreate, userSearch, userUpdate, userAuth, userReg, avatarUpdate,
} = messages;

async function getUsers(req, res, next) {
  let users;

  try {
    users = await User.find({});
    res.send(users);
  } catch (e) {
    next(e);
  }
}

async function findUser(req, res, next) {
  const id = req.params.userId;
  let user;

  try {
    user = await User.findById(id);

    if (!user) {
      throw new SearchError(userSearch);
    }

    res.send({ data: user });
  } catch (e) {
    next(e);
  }
}

async function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  let hash;
  let user;

  try {
    hash = await bcrypt.hash(password, 10);

    try {
      user = await User.create({
        name, about, avatar, email, password: hash,
      });
      res.send({ data: user });
    } catch (e) {
      next(e);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      const error = new DataError(userCreate);
      next(error);
    } else if (e.name === 'MongoError' && e.code === 11000) {
      const error = new RegisterError(userReg);
      next(error);
    }
    next(e);
  }
}

async function updateUser(req, res, next) {
  const id = req.user._id;
  const { name, about } = req.body;
  let user;

  try {
    user = await User.findByIdAndUpdate(
      id, { name, about }, {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    if (!user) {
      throw new SearchError(userSearch);
    }

    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const error = new DataError(userUpdate);
      next(error);
    }
    next(e);
  }
}

async function updateAvatar(req, res, next) {
  const id = req.user._id;
  const { avatar } = req.body;
  let user;

  try {
    user = await User.findByIdAndUpdate(
      id, { avatar }, {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    if (!user) {
      throw new SearchError(userSearch);
    }

    res.send(user);
  } catch (e) {
    const bool = e.name === 'ValidationError' || 'CastError';
    if (bool) {
      const error = new DataError(avatarUpdate);
      next(error);
    }

    next(e);
  }
}

// eslint-disable-next-line consistent-return
async function login(req, res, next) {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
    return res.cookie('token', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    }).send(user.toJSON());
  } catch (e) {
    const error = new AuthError(userAuth);
    next(error);
  }
}

function logout(req, res) {
  return res.clearCookie('token').send({ message: 'Вы вышли из личного кабинета' });
}

async function getUserInfo(req, res, next) {
  const id = req.user._id;
  let user;

  try {
    user = await User.findById(id);

    if (!user) {
      throw new SearchError(userSearch);
    }

    res.send(user);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getUsers,
  findUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  logout,
  getUserInfo,
};
