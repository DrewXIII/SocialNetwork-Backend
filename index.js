"use strict";

// Separo el llamamiento a las librerías del llamamiento a los archivos de mi proyecto.

// Librerías utilizadas en este archivo:

require("dotenv").config(); // Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
const bodyParser = require("body-parser"); // Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const express = require("express"); //Fast, unopinionated, minimalist web framework for node.
const routers = require("./webserver/routes"); // Aquí llamo a todas las rutas que se van a poder utilizar en este Backend y que tengo hechas en otros archivos.
const mysqlPool = require("./databases/mysql-pool");
const mongoPool = require("./databases/mongo-pool"); // Esto es para usar Mongo DB.

const app = express();
app.use(bodyParser.json()); // Parse application/json

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).send({
    error: `Body parser: ${err.message}`
  });
});

// Activo los endpoints que van a estar disponibles

app.use("/api", routers.accountRouter);
app.use("/api", routers.postRouter);
app.use("/api", routers.userRouter);

app.use((err, req, res, next) => {
  const { name: errorName } = err;

  if (errorName === "AccountNotActivatedError") {
    return res.status(403).send({
      message: err.message
    });
  }

  return res.status(500).send({
    error: err.message
  });
});

// Por último, activo la conexión a Mongo DB y MySQL y al puerto.

async function init() {
  try {
    await mysqlPool.connect();
    await mongoPool.connect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server running and listening on port ${port}`);
  });
}

init();
