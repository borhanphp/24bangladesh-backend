const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createVideo,
  getVideo,
  updateVideo,
} = require("../../Controller/v1/videoController");

// upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

// import middleware
const { authenticationroute } = require("../../Middleware/v1/Authentication");

// api
route.post("/", authenticationroute, upload.single("image"), createVideo);
route.get("/", authenticationroute, getVideo);
route.patch("/:id", authenticationroute, upload.single("image"), updateVideo);

// export
module.exports = route;
