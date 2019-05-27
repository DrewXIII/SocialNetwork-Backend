'use strict';

const jwt = require('jsonwebtoken');

const { AUTH_JWT_SECRET: authJwtSecret } = process.env;

function checkJwtToken(req, res, next) {
  // checkeará el token jwt que viene en el header como authorization
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send();
  }

  //   if (!authorization.startsWith('JWT '))
  const [prefix, token] = authorization.split(' '); // [JWT, xxxx]
  if (prefix !== 'JWT') {
    return res.status(401).send();
  }

  if (!token) {
    return res.status(401).send();
  }

  try {
    const decoded = jwt.verify(token, authJwtSecret);

    req.claims = {
      uuid: decoded.uuid,
      role: decoded.role,
    };

    return next();
  } catch (e) {
    return res.status(401).send();
  }
}

module.exports = checkJwtToken;
