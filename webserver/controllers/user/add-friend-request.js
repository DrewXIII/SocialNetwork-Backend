'use strict';

const Joi = require('joi');
const UserModel = require('../../../models/user-model');

async function validate(payload) {
  const schema = {
    uuid: Joi.string().guid({
      version: ['uuidv4'],
    }),
  };

  return Joi.validate(payload, schema);
}

async function addFriendRequest(req, res, next) {
  const friendData = { ...req.body };
  const { uuid } = req.claims;

  try {
    await validate(friendData);
  } catch (e) {
    return res.status(400).send(e);
  }

  if (uuid === friendData.uuid) {
    return res.status(403).send(); // 409 conflict
  }

  /**
   * Tenemos que añadir una petición de amistad en el array de friends
   * de mi amigo diciendo que soy yo quien quiere la peticion
   * {
    uuid: String,
    createdAt: Date,
    confirmedAt: Date,
    rejectedAt: Date,
  }
   */
  const filter = {
    uuid: friendData.uuid,
    friends: {
      $not: {
        $elemMatch: {
          uuid,
        },
      },
    },
  };

  const op = {
    $push: {
      friends: {
        uuid,
        createdAt: Date.now(),
        confirmedAt: null,
        rejectedAt: null,
      },
    },
  };

  try {
    const result = await UserModel.updateOne(filter, op);

    console.log(result);

    return res.status(201).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = addFriendRequest;
