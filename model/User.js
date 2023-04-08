const mongoose = require("mongoose");

const User = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  number: {
    type: String,
  },

  aboutMe: {
    type: String,
  },
  links: {
    linkedin: String,

    github: String,

    facebook: String,

    twitter: String,

    instagram: String,

    website: String,
  },
  professional_info: {
    eduaction: String,

    occupation: String,
  },
  interest: [
    {
      type: String,
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  avatar: {
    publicId: String,
    url: String,
  },
});

module.exports = mongoose.model("user", User);
