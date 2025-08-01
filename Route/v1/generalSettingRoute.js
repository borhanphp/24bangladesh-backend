const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// import controllar
const {
  createNUpdateInfo,
  getInfo,
} = require("../../Controller/v1/generalController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, upload.single("image"), createNUpdateInfo);
route.get("/", authenticationroute, getInfo);

// web route
route.get("/web", getInfo);

// export
module.exports = route;
