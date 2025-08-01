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
  createImage,
  getImage,
  deleteImage,
  getImageformFolder,
  deleteImageFromFolder,
} = require("../../Controller/v1/imageController");

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, upload.single("image"), createImage);
route.get("/", authenticationroute, getImage);
route.get("/folder", authenticationroute, getImageformFolder);
route.delete("/:id", authenticationroute, deleteImage);
route.delete("/uplfolderoad/:filename", deleteImageFromFolder);

// export
module.exports = route;
