const express = require("express");
const router = express.Router();

//  news
const newsRoute = require("./Route/v1/postRoute");
router.use("/news", newsRoute);

//  menu
const menuRoute = require("./Route/v1/menuSettingRoute");
router.use("/menu", menuRoute);

//  video
router.use("/video", newsRoute);

//  topic
const topicRoute = require("./Route/v1/topicRoute");
router.use("/topic", topicRoute);

//  topic
const dscRoute = require("./Route/v1/dscRoute");
router.use("/dsc", dscRoute);

//  meta info
const genarelRoute = require("./Route/v1/generalSettingRoute");
router.use("/meta", genarelRoute);

//  footer
const footerRoute = require("./Route/v1/footerRoute");
router.use("/footer", footerRoute);

//  footer
const pageRoute = require("./Route/v1/pageRoute");
router.use("/page", pageRoute);

module.exports = router;
