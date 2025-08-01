const express = require("express");
const route = express.Router();

// import controllar
const {
  createTopic,
  getTopic,
  updateTopic,
  getNewsByTopicSlug,
} = require("../../Controller/v1/topicController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, createTopic);
route.get("/", authenticationroute, getTopic);
route.patch("/:id", authenticationroute, updateTopic);
// web
route.get("/news", getTopic);
route.get("/singlenews/:slug", getNewsByTopicSlug);

// export
module.exports = route;
