const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      reuired: ["true", "username reuired"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      reuired: ["true", "email reuired"],
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      reuired: ["true", "password reuired"],
      trim: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRATION_DATE,
    }
  );
};

// Validate Register User
const User = mongoose.model("User", UserSchema);

function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
};
