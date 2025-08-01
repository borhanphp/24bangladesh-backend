const express = require("express");
const route = express.Router();

// import controllar
const {
  createCategory,
  getCategory,
  updateCategory,
} = require("../../Controller/v1/categoryController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createCategory);
route.get("/", authenticationroute, getCategory);
route.patch("/:id", authenticationroute, updateCategory);

// export
module.exports = route;
