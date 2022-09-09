// const mongoose = require("mongoose");
const ErrorHandler = require("../util/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../util/apiFeature");
const cloudinary = require("cloudinary");
const { validationResult } = require("express-validator");
const Phone = require("../models/phone");

// Route 0: get all phones -> api/phones/getphones
const getAdminPhone = catchAsyncError(async (req, res, next) => {
  const phones = await Phone.find();

  res.status(200).json({
    success: true,
    phones,
  });
});

// Route 1: get all phones -> api/phones/getphones
const getAllPhone = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 20;
  const phoneCount = await Phone.countDocuments();

  const apiFeature = new ApiFeatures(Phone.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const phones = await apiFeature.query;

  res.status(200).json({
    success: true,
    phones,
    phoneCount,
  });
});

// Route 2: get phone by id -> api/phones/getphones
const getPhoneById = catchAsyncError(async (req, res, next) => {
  const phone = await Phone.findById(req.params.pid);

  if (!phone) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, phone });
});

// Route 3: create phone -> api/phones/createPhone
const createPhone = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorHandler("Invalid input. Please check the input again.", 422)
    );
    // return res.status(400).json({ errors: errors.array() });
  }

  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "phones",
    // width: 150,
    // crop: "scale",
  });
  req.body.creator = req.user.id;
  const creator = req.body.creator;
  const {
    company,
    name,
    RAM,
    processor,
    display,
    storage,
    camera,
    os,
    category,
    battery,
    network,
    security,
    sensors,
    nfc,
    packagecontains,
    price,
    externalMemory,
    processorExtraOne,
    processorExtraTwo,
    processorExtraThree,
    displayExtraOne,
    displayExtraTwo,
    displayExtraThree,
    displayExtraFour,
    displayExtraFive,
    cameraExtraOne,
    cameraExtraTwo,
    cameraExtraThree,
    batteryExtraOne,
    batteryExtraTwo,
    batteryExtraThree,
    osExtraOne,
    osExtraTwo,
    osExtraThree,
    sensorsExtraOne,
    sensorsExtraTwo,
    sensorsExtraThree,
    networkExtraOne,
    networkExtraTwo,
    networkExtraThree,
    nfcExtraOne,
    nfcExtraTwo,
    nfcExtraThree,
    securityExtraOne,
    securityExtraTwo,
    packagecontainsExtraOne,
    packagecontainsExtraTwo,
  } = req.body;

  const phone = await Phone.create({
    company,
    name,
    RAM,
    processor,
    display,
    storage,
    camera,
    os,
    category,
    battery,
    network,
    security,
    sensors,
    nfc,
    packagecontains,
    price,
    creator,
    externalMemory,
    processorExtraOne,
    processorExtraTwo,
    processorExtraThree,
    displayExtraOne,
    displayExtraTwo,
    displayExtraThree,
    displayExtraFour,
    displayExtraFive,
    cameraExtraOne,
    cameraExtraTwo,
    cameraExtraThree,
    batteryExtraOne,
    batteryExtraTwo,
    batteryExtraThree,
    osExtraOne,
    osExtraTwo,
    osExtraThree,
    sensorsExtraOne,
    sensorsExtraTwo,
    sensorsExtraThree,
    networkExtraOne,
    networkExtraTwo,
    networkExtraThree,
    nfcExtraOne,
    nfcExtraTwo,
    nfcExtraThree,
    securityExtraOne,
    securityExtraTwo,
    packagecontainsExtraOne,
    packagecontainsExtraTwo,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({ success: true, phone });
});

// Route 4: update phone ->
const updatePhone = catchAsyncError(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorHandler("Invalid input. Please check the input again.", 422)
    );
  }
  let phone = await Phone.findById(req.params.pid);

  if (!phone) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // let newPhoneData;
  const newPhoneData = ({
    company: req.body.company,
    name: req.body.name,
    RAM: req.body.RAM,
    processor: req.body.processor,
    display: req.body.display,
    storage: req.body.storage,
    camera: req.body.camera,
    os: req.body.os,
    category: req.body.category,
    battery: req.body.battery,
    network: req.body.network,
    security: req.body.security,
    sensors: req.body.sensors,
    nfc: req.body.nfc,
    packagecontains: req.body.packagecontains,
    price: req.body.price,
    externalMemory: req.body.externalMemory,
    processorExtraOne: req.body.processorExtraOne,
    processorExtraTwo: req.body.processorExtraTwo,
    processorExtraThree: req.body.processorExtraThree,
    displayExtraOne: req.body.displayExtraOne,
    displayExtraTwo: req.body.displayExtraTwo,
    displayExtraThree: req.body.displayExtraThree,
    displayExtraFour: req.body.displayExtraFour,
    displayExtraFive: req.body.displayExtraFive,
    cameraExtraOne: req.body.cameraExtraOne,
    cameraExtraTwo: req.body.cameraExtraTwo,
    cameraExtraThree: req.body.cameraExtraThree,
    batteryExtraOne: req.body.batteryExtraOne,
    batteryExtraTwo: req.body.batteryExtraTwo,
    batteryExtraThree: req.body.batteryExtraThree,
    osExtraOne: req.body.osExtraOne,
    osExtraTwo: req.body.osExtraTwo,
    osExtraThree: req.body.osExtraThree,
    sensorsExtraOne: req.body.sensorsExtraOne,
    sensorsExtraTwo: req.body.sensorsExtraTwo,
    sensorsExtraThree: req.body.sensorsExtraThree,
    networkExtraOne: req.body.networkExtraOne,
    networkExtraTwo: req.body.networkExtraTwo,
    networkExtraThree: req.body.networkExtraThree,
    nfcExtraOne: req.body.nfcExtraOne,
    nfcExtraTwo: req.body.nfcExtraTwo,
    nfcExtraThree: req.body.nfcExtraThree,
    securityExtraOne: req.body.securityExtraOne,
    securityExtraTwo: req.body.securityExtraTwo,
    packagecontainsExtraOne: req.body.packagecontainsExtraOne,
    packagecontainsExtraTwo: req.body.packagecontainsExtraTwo,
  } = req.body);
  // console.log("hi");
  if (req.body.image !== null) {
    const phone = await Phone.findById(req.params.pid);
    const imgId = phone.image.map((img) => img.public_id);
    await cloudinary.v2.uploader.destroy(imgId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "phones",
    });

    newPhoneData.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  phone = await Phone.findByIdAndUpdate(req.params.pid, newPhoneData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true });
});

// Route 5: delete phone -> api/phones/deletePhone
const deletePhone = catchAsyncError(async (req, res, next) => {
  const deletePhone = await Phone.findById(req.params.pid);

  if (!deletePhone) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // delete image from cloudinary
  for (let i = 0; i < deletePhone.image.length; i++) {
    await cloudinary.v2.uploader.destroy(deletePhone.image[i].public_id);
  }

  await deletePhone.remove();

  res
    .status(200)
    .json({ success: true, message: "Phone deleted successfully" });
});

// Route 6: compare phone
const comparePhone = catchAsyncError(async (req, res, next) => {
  const phoneOne = await Phone.findOne({ name: req.params.phoneOne });
  const phoneTwo = await Phone.findOne({ name: req.params.phoneTwo });

  if (!phoneOne) {
    return next(
      new ErrorHandler(
        `${req.params.phoneOne} phone not found. Please enter a valid phone name.`
      )
    );
  }
  if (!phoneTwo) {
    return next(
      new ErrorHandler(
        `${req.params.phoneTwo} phone not found. Please enter a valid phone name.`
      )
    );
  }

  res.status(200).json({ success: true, phoneOne, phoneTwo });
});

// Route 7: create and update review
const createReview = catchAsyncError(async (req, res, next) => {
  const { comment, phoneId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
  };

  const phone = await Phone.findById(phoneId);

  const isReviewed = phone.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    phone.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
      }
    });
  } else {
    phone.reviews.push(review);
  }

  await phone.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// route 7: get all reviews
const getPhoneReviews = catchAsyncError(async (res, req, next) => {
  const phone = await Phone.findById(req.query.id);

  if (!phone) {
    return next(new ErrorHandler("Phone not found.", 404));
  }

  res.status(200).json({
    success: true,
    reviews: phone.reviews,
  });
});

const deleteReview = catchAsyncError(async (req, res, next) => {
  const phone = await Phone.findById(req.query.phoneId);

  if (!phone) {
    return next(new ErrorHandler("Phone not found.", 404));
  }

  const reviews = phone.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );

  await Phone.findByIdAndUpdate(
    req.query.phoneId,
    {
      reviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  // await phone.save({ validateBeforeSave: true });

  // const reviews = await phone.reviews;

  // const review = await reviews.find(req.query.reviewId);

  // if (!review) {
  //   return next(new ErrorHandler("Review not found.", 404));
  // }

  // await review.remove();

  res.status(200).json({
    success: true,
  });
});

exports.getAdminPhone = getAdminPhone;
exports.getAllPhone = getAllPhone;
exports.getPhoneById = getPhoneById;
exports.createPhone = createPhone;
exports.updatePhone = updatePhone;
exports.deletePhone = deletePhone;
exports.comparePhone = comparePhone;
exports.createReview = createReview;
exports.getPhoneReviews = getPhoneReviews;
exports.deleteReview = deleteReview;
