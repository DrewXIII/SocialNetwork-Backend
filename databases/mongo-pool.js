"use strict";

const mongoose = require("mongoose"); // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.

// Con lo siguiente entramos en el archivo .env para conectarnos a Mongo DB con los datos guardados (buscamos la base de datos asociada a este proyecto en el archivo .env).

const { MONGO_URI: mongoUri } = process.env;

// A continuación creamos las funciones para conectarse a Mongo DB y para desconectarse.

async function connect() {
  const conn = await mongoose.connect(mongoUri, { useNewUrlParser: true });

  return conn;
}

async function disconnect() {
  mongoose.connection.close();
}

// Por último, exportamos todo para poder utilizarlo en otro archivo.

module.exports = {
  connect,
  disconnect
};
