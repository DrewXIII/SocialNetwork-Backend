"use strict";

// En este archivo junto todas las rutas creadas para así exportarlas todas juntas.

const accountRouter = require("./account-router");
const postRouter = require("./post-router");
const userRouter = require("./user-router");

module.exports = {
  accountRouter,
  postRouter,
  userRouter
};
