const express = require("express");
const route = express.Router();

// import controllar
const {
  getRageDataSales,
  //   createConfigInfo,
} = require("../../Controller/dashboradController");

// import middleware

const { authenticationroute } = require("../../Middleware/Authentication");

// api.
route.get("/range/sales", authenticationroute, getRageDataSales);

// export
module.exports = route;
