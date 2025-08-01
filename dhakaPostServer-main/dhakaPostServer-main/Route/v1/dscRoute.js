const express = require("express");
const route = express.Router();

// import controllar
const { getDSC } = require("../../Controller/v1/dscController");

// web
route.get("/", getDSC);

// export
module.exports = route;
