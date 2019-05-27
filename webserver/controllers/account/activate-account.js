'use strict';

const mysqlPool = require('../../../databases/mysql-pool');

async function activate(req, res, next) {
  const { verification_code: verificationCode } = req.query;

  if (!verificationCode) {
    return res.status(400).json({
      message: 'invalid verification code',
      target: 'verification_code',
    });
  }

  const now = new Date();
  const sqlActivateQuery = `UPDATE users_activation
SET verified_at = '${now.toISOString().substring(0, 19).replace('T', ' ')}'
WHERE verification_code='${verificationCode}'
AND verified_at IS NULL`;

  try {
    const connection = await mysqlPool.getConnection();
    const result = await connection.query(sqlActivateQuery);

    if (result[0].affectedRows === 1) {
      const sqlActivateUserQuery = `UPDATE users u
      JOIN users_activation uv
      ON u.uuid = uv.user_uuid
      AND u.activated_at IS NULL
      AND uv.verification_code = '${verificationCode}'
      SET u.activated_at = uv.verified_at`;

      const resultActivateUser = await connection.query(sqlActivateUserQuery);
      if (resultActivateUser[0].affectedRows === 1) {
        connection.release();
        return res.send('account activated');
      }
      /*
      connection.query(sqlActivateUserQuery).then((resultActivateUSer) => {

      }).catch((err) => {

      });
      */
    }

    // algo no fue ok
    connection.release();
    return res.send('verification code invalid');
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = activate;
