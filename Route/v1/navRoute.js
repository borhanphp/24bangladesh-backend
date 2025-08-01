const express = require("express");
const route = express.Router();

// import controllar
const { getNav } = require("../../Controller/v1/navController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
// route.get("/", authenticationroute, getNav);
route.get("/", getNav);

// export
module.exports = route;
