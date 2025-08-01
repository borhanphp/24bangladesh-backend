const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createSection,
  getSection,
  updateSection,
} = require("../../Controller/v1/sectionController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createSection);
route.get("/", authenticationroute, getSection);
route.patch("/:id", authenticationroute, updateSection);

// export
module.exports = route;
