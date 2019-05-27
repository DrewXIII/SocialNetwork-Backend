'use strict';

const Joi = require('joi');
const UserModel = require('../../../models/user-model');

/**
 * Validate if search data is valid
 * @param {Object} payload Object to be validated. { q: String to search }
 * @return {Object} null if data is valid, throw an Error if data is not valid
 */
async function validate(payload) {
  const schema = {
    q: Joi.string().min(3).max(128).required(),
  };

  return Joi.validate(payload, schema);
}

async function searchUsers(req, res, next) {
  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e);
  }

  const op = {
    $text: {
      $search: q,
    },
  };

  const scoreSearch = {
    score: {
      $meta: 'textScore',
    },
  };

  try {
    const users = await UserModel.find(op, scoreSearch).sort(scoreSearch).lean();

    const usersMinimumInfo = users.map((userResult) => {
      const {
        uuid,
        fullName,
        avatarUrl,
        score,
      } = userResult;

      return {
        uuid,
        fullName,
        avatarUrl,
        score,
      };
    });

    return res.send(usersMinimumInfo);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = searchUsers;
