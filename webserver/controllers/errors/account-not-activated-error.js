'use strict';

class AccountNotActivatedError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'AccountNotActivatedError';
  }
}

module.exports = AccountNotActivatedError;
