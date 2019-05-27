"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

const wallSchema = new Schema({
  uuid: {
    type: String,
    unique: true
  },
  posts: [Schema.ObjectId] // https://mongoosejs.com/docs/schematypes.html#objectids
});

const Wall = mongoose.model("Wall", wallSchema); // When you call mongoose.model() on a schema, Mongoose compiles a model for you. The .model() function makes a copy of schema. Make sure that you've added everything you want to schema, including hooks, before calling .model()! The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example above, the model 'Wall' is for the 'walls' collection in the database.

module.exports = Wall;
