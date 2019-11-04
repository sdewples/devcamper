const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');


// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to remove for querying
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Get operators from queryStr
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Find bootcamp by queryStr parameters
  query = Bootcamp.find(JSON.parse(queryStr));
  
  // if select is in req query
  if (req.query.select) {
    // format query for mongodb
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // if sort is in sort query
  if (req.query.sort) {
    // format query for mongodb
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination and limit
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page -1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // execute query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination, data: bootcamps });

});

// @desc      Get a bootcamp 
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: bootcamp })
});

// @desc      Create a bootcamp 
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

const bootcamp = await Bootcamp.create(req.body);

res
  .status(201)
  .json({ success: true, data: bootcamp });

});

// @desc      Update a bootcamp 
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({success: true, data: bootcamp});
  
});

// @desc      Update a bootcamp 
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({success: true, data: {} });
  
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
const { zipcode, distance } = req.params;

// Get latitude and longitude
const loc = await geocoder.geocode(zipcode);
const lat = loc[0].latitude;
const lng = loc[0].longitude;

// Calculate radius using radians
// Divide distance by radius of Earth
// Earth Radius = 3,963 miles / 6,378 km
const radius = distance / 3963;

const bootcamps = await Bootcamp.find({
  location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
});

res.status(200).json({
  success: true,
  count: bootcamps.length,
  data: bootcamps
});
});