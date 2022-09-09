const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ErrorHandler = require("../util/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const sendToken = require("../util/jwtToken");
const sendEmail = require("../util/sendEmail.js");

// console.log(uuid.v4());

// Route 1: register user
// const registerUser = catchAsyncError(async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new ErrorHandler("Invalid input. Please check the input again", 422)
//     );
//   }

//   const { email } = req.body;

//   const emailId = await User.findOne({ email });

//   if (emailId) {
//     return next(
//       new ErrorHandler("Email already exists. Please login instead.", 400)
//     );
//   }

//   const user = await User.create(req.body);

//   const token = await user.getJWTToken();

//   // res.cookie("token", token, {
//   //   expires: new Date(
//   //     Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//   //   ),
//   //   httponly: true,
//   // });
//   // res.cookie("token", token, {
//   //   expires: new Date(new Date().getTime() + 10 * 86400000),
//   //   httponly: true,
//   // });
//   res.status(200).json({ success: true, token, user });
// });

const registerUser = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorHandler("Invalid input. Please check the input again", 422)
    );
  }

  // const userData = req.body;

  const userExist = await User.findOne({ email: req.body.email });

  // console.log(user.emailVerifyTime);
  // console.log(Date.now());

  if (userExist && userExist.verified === true) {
    return next(
      new ErrorHandler("Email already exists. Please login instead.", 400)
    );
  }

  if (!userExist) {
    await User.create(req.body);
  }

  // const unverifiedEmail = await User.findOne({ email})

  const user = await User.findOne({ email: req.body.email });

  const emailToken = await user.verifyEmail();

  await user.save();
  // await user.save({ validateBeforeSave: false });

  // const user = await User.create({userData});
  // const user = await User.create({userData, emailLink});

  const verifyEmailUrl = `http://localhost:8000/api/user/verify/${emailToken}`;

  const message = `Click on the given link to verfy your email \n\n ${verifyEmailUrl}.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Verify Your Email`,
      message,
    });

    res.status(200).json({
      success: true,
      verified: user.verified,
      message: `An Email has been sent to you. Please verify your email.`,
    });
  } catch (error) {
    user.verified = false;
    user.emailLink = undefined;
    user.emailVerifyTime = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// verify email
const verifyUser = catchAsyncError(async (req, res, next) => {
  let emailToken = req.params.token;

  const user = await User.findOne({
    emailLink: emailToken,
    emailVerifyTime: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("The email link is invalid or has been expired.")
    );
  }

  // await user.remove({
  //   emailVerifyTime: { $lt: Date.now() },
  //   verified: false,
  // })
  if (user.verified === false && user.emailVerifyTime < Date.now()) {
    await User.remove({ emailLink: emailToken });
  }

  user.verified = true;

  await user.save();

  // const token = await user.getJWTToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  //   user,
  // });
  res
    .status(200)
    .send("Your email has been verified. Please log in to proceed.");
});

// Route 2: login user
const userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && user.verified === false && user.emailVerifyTime < Date.now()) {
    await user.deleteOne();
  }

  if (!user) {
    return next(new ErrorHandler("Please enter valid credentials", 401));
  }
  if (user.verified === false) {
    return next(new ErrorHandler("Please verify your email first", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  // const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Please enter valid credentials", 401));
  }

  const token = await user.getJWTToken();

  // sendToken(user, 201, res, token);
  res
    .status(200)
    // .cookie("token", token, {
    //   expires: new Date(
    //     Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    // })
    // .json({ success: true, token });
    .json({ success: true, token, user });
});

// Route 3: logout
const userLogout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "logout successful" });
});

// Route 4: get user details
const getUserDetail = catchAsyncError(async (req, res, next) => {
  let user = await User.findById(req.user.id);

  res.status(200).json({ success: true, user });
});

// Route 5: update the user profile
const updateProfile = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorHandler("Invalid input. Please check the input again", 422)
    );
  }
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Route 7: get all the user - Admin
const getAllUser = catchAsyncError(async (req, res, next) => {
  let users = await User.find();

  if (!users) {
    return res.status(404).json({ message: "user not found" });
  }

  res.status(200).json({
    success: true,
    users,
  });
});

// Route 7: delete a user - admin
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`Users not found with id: ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Route 8: update user role - admin
const updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Route 9: get a single user (admin)
const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(
        `User does not match with the id : ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//email verify

exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.userLogin = userLogin;
exports.userLogout = userLogout;
exports.getAllUser = getAllUser;
exports.updateProfile = updateProfile;
exports.deleteUser = deleteUser;
exports.getUserDetail = getUserDetail;
exports.updateUserRole = updateUserRole;
exports.getSingleUser = getSingleUser;
