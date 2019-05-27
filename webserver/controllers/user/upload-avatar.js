'use strict';

const cloudinary = require('cloudinary');
const UserModel = require('../../../models/user-model');

cloudinary.config({
  cloud_name: process.env.CLOUDINARI_CLOUD_NAME,
  api_key: process.env.CLOUDINARI_API_KEY,
  api_secret: process.env.CLOUDINARI_API_SECRET,
});

async function uploadAvatar(req, res, next) {
  const { file } = req;
  const { uuid } = req.claims;

  if (!file || !file.buffer) {
    return res.status(400).send();
  }

  cloudinary.v2.uploader.upload_stream({
    resource_type: 'raw',
    public_id: uuid,
    width: 200,
    height: 200,
    format: 'jpg',
    crop: 'limit',
  }, async(err, result) => {
    if (err) {
      return res.status(400).send(err);
    }

    const {
      etag,
      secure_url: secureUrl,
    } = result;
    
    // actualizar user con la url del avatar
    const filter = {
      uuid,
    };

    const operation = {
      avatarUrl: secureUrl,
    };

    try {
      await UserModel.updateOne(filter, operation);
    } catch (e) {
      return res.status(500).send(e.message);
    }

    res.header('Location', secureUrl);
    res.status(201).send();
  }).end(file.buffer);
}

module.exports = uploadAvatar;
