'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  friends: [{
    uuid: String,
    createdAt: Date,
    confirmedAt: Date,
    rejectedAt: Date,
  }],
  avatarUrl: String,
  fullName: String,
  preferences: {
    isPublicProfile: Boolean,
    linkedIn: String,
    twitter: String,
    github: String,
    description: String,
  },
});

userSchema.index(
  {
    fullName: 'text',
    'preferences.linkedIn': 'text',
    'preferences.twitter': 'text',
    'preferences.github': 'text',
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
