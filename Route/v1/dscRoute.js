const express = require("express");
const route = express.Router();

// import controllar
const { getDSC, testPuppeteer } = require("../../Controller/v1/dscController");

// test puppeteer
route.get("/test", testPuppeteer);

// web
route.get("/", getDSC);

// export
module.exports = route;
