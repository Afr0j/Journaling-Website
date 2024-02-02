import { User } from "../models/user.model.js";
import wrapper from "../utils/wrapper.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const ObjectId = mongoose.Types.ObjectId

const generateRefreshAndAccessToken = async (user) => {
  // const user = await User.findById(id);
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    const updatedUser =await user.save();
    
  return { accessToken, refreshToken, updatedUser };
  } catch (error) {
    throw new ApiError(500, error.message);
  }

}

const registerUser = wrapper (async (req,res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

    return await newUser.save().then(() => {
      res.redirect("/user/login");
    }).catch((err) => {
      throw new ApiError(err.statusCode, err.message );
    });
});

const loginUser = wrapper(async (req, res) => {
  const {username, password} = req.body;
 
  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Password is incorrect");
  } 

  const {accessToken,updatedUser,refreshToken}= await generateRefreshAndAccessToken(user);

  const options = {
  secure: true,
    httpOnly: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .redirect("/");
})

const logoutUser = wrapper(async (req, res) => {
  const id = new ObjectId(req.user.id);
  const user = await User.findOneAndUpdate({_id:id},{refreshToken:null});
  res.clearCookie("accessToken").clearCookie("refreshToken").redirect("/user/login");
})

const regenerateAccessToken = wrapper(async (req, res) => {
  const existingRefreshToken = req.cookies.refreshToken|| req.headers.Authorization;
  if (!existingRefreshToken) {
    throw new ApiError(401, "Refresh token is not valid");
  }

  try {
    const decoded= jwt.verify(existingRefreshToken, process.env.REFRESH_SECRET_KEY);
    if(!decoded){
      throw new ApiError(401, "Refresh token is not valid");
    }
  
    const user = await User.findById(decoded.id);
    if(!user){
      throw new ApiError(404, "User not found");
    }
  
    if(user.refreshToken !== existingRefreshToken){
      throw new ApiError(401, "Refresh token is not valid");
    }
    
    const { accessToken,newRefreshToken } = await generateRefreshAndAccessToken(user);
    const options={
      secure: true,
      httpOnly: true,
    }
    console.log("regenerated");
    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .redirect("/");
  } catch (error) {
    throw new ApiError(401, error.message);
  }
})

export  {registerUser, loginUser, logoutUser,regenerateAccessToken};
