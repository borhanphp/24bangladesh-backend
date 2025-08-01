const express = require("express");
const route = express.Router();

// import controllar
const {
  createRole,
  updateRole,
  allRole,
} = require("../../Controller/v1/roleController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createRole);
route.get("/", authenticationroute, allRole);
route.patch("/:id", authenticationroute, updateRole);

// export
module.exports = route;
