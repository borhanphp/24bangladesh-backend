const express = require("express");
const route = express.Router();

// import controllar
const { getLocation } = require("../../Controller/v1/locationController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
// route.get("/", authenticationroute, getNav);
route.get("/", getLocation);

// export
module.exports = route;
