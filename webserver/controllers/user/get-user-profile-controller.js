'use strict';

const UserModel = require('../../../models/user-model');

async function getUserProfile(req, res, next) {
  const { uuid } = req.claims;

  const projection = {
    _id: 0,
    __v: 0,
  };

  const userProfile = await UserModel.findOne({ uuid }, projection);

  return res.status(200).send(userProfile);
}

module.exports = getUserProfile;
