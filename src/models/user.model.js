import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
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
  },
  refreshToken:{
    type: String,
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { username: this.username, email: this.email, id: this._id },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: process.env.ACCESS_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {

  return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: process.env.REFRESH_EXPIRY,
  });
};  

const User = new mongoose.model("User", userSchema);

export { User, userSchema };
