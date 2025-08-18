const express = require("express");
const route = express.Router();

const { getCategoriesWeb } = require("../../Controller/v1/categoryWebController");

route.get("/", getCategoriesWeb);

module.exports = route;


