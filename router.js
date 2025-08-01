const express = require("express");
const router = express.Router();

//  cheack
const { authentication } = require("./Middleware/v1/Authentication");
router.use("/routeProtection", authentication);

//  users
const navRoute = require("./Route/v1/navRoute");
router.use("/nav", navRoute);

//  users
const authRoute = require("./Route/v1/authRoute");
router.use("/user", authRoute);

//  role
const roleRoute = require("./Route/v1/roleRoute");
router.use("/role", roleRoute);

//  location
const locationRoute = require("./Route/v1/locaitonRoute");
router.use("/location", locationRoute);

//  Category
const categoryRoute = require("./Route/v1/categoryRoute");
router.use("/category", categoryRoute);

//  topic
const topicRoute = require("./Route/v1/topicRoute");
router.use("/topic", topicRoute);

//  News
const newsRoute = require("./Route/v1/postRoute");
router.use("/news", newsRoute);

//  Section Category
const sectionRoute = require("./Route/v1/sectionRoute");
router.use("/section", sectionRoute);

//  Menu Seeting
const menuRoute = require("./Route/v1/menuSettingRoute");
router.use("/menu", menuRoute);

//  video
const videoRoute = require("./Route/v1/videoRoute");
router.use("/video", videoRoute);

//  Image Update
const imageRoute = require("./Route/v1/imageRoute");
router.use("/image", imageRoute);

//  General Seeting
const generalSettingRoute = require("./Route/v1/generalSettingRoute");
router.use("/meta", generalSettingRoute);

//  footer
const footerRoute = require("./Route/v1/footerRoute");
router.use("/footer", footerRoute);

//  page
const PageRoute = require("./Route/v1/pageRoute");
router.use("/page", PageRoute);

//  DSC
const dscRoute = require("./Route/v1/dscRoute");
router.use("/dsc", dscRoute);

module.exports = router;
