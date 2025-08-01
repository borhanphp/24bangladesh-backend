const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createPage,
  getPage,
  updatePagebySlug,
  getPageBySlug,
} = require("../../Controller/v1/pageController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createPage);
route.get("/", authenticationroute, getPage);
route.patch("/:slug", authenticationroute, updatePagebySlug);

// web
route.get("/web", getPage);
route.get("/webPage/:slug", getPageBySlug);

// export
module.exports = route;
