'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  owner: String,
  author: String,
  content: String,
  likes: [String],
  comments: [{
    message: String,
    createdAt: Date,
    author: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: Date,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
