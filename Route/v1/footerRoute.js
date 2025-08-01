const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createNUpdateInfo,
  getInfo,
} = require("../../Controller/v1/footerController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createNUpdateInfo);
route.get("/", authenticationroute, getInfo);

// web
route.get("/web", getInfo);

// export
module.exports = route;
