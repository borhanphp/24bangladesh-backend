const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createMenu,
  getMenu,
  updateMenu,
  getWebNavigation,
} = require("../../Controller/v1/menuController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createMenu);
route.get("/", authenticationroute, getMenu);
route.patch("/:id", authenticationroute, updateMenu);

// web
route.get("/getMenu", getWebNavigation);

// export
module.exports = route;
