const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createUser,
  signin,
  updateUser,
  allUser,
  singleUser,
} = require("../../Controller/v1/authController");

// import middleware
const { validation } = require("../../Middleware/Validation");
const { authenticationroute } = require("../../Middleware/v1/Authentication");

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

// api
route.post(
  "/create",
  upload.single("image"),
  validation,
  authenticationroute,
  createUser
);
route.get("/", authenticationroute, allUser);
route.get("/single", authenticationroute, singleUser);
route.patch("/:id", upload.single("image"), authenticationroute, updateUser);
route.post("/signin", signin);

// export
module.exports = route;
