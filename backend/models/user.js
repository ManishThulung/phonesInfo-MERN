const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  emailLink: {
    type: String,
    unique: true,
  },
  emailVerifyTime: {
    type: Date,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getJWTToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

UserSchema.methods.verifyEmail = async function () {
  const emailToken = uuid.v4();

  // this.emailLink = await bcrypt.hash(emailLink, 10);

  this.emailLink = emailToken;
  this.emailVerifyTime = Date.now() + 15 * 60 * 1000;

  return emailToken;
};
module.exports = mongoose.model("User", UserSchema);
