const express = require("express");
const route = express.Router();
const path = require("path");
const multer = require("multer");

// import controllar
const {
  createPost,
  getPost,
  updatePost,
  getPostWeb,
  getSinglePostWeb,
  getAllPostWeb,
  getCategoryPostWeb,
  getAllCategoryPostWeb,
  getlatestNewsWeb,
  getLiveNewsWeb,
  geVideoNewsWeb,
  geSingleVideoNewsWeb,
  getTopNewsWeb,
  getPopularPosts,
  getPopulerNewsWeb,
} = require("../../Controller/v1/postController");

// import middleware
const {
  authenticationroute,
  webMiddleware,
} = require("../../Middleware/v1/Authentication");

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
route.post("/", authenticationroute, upload.single("image"), createPost);
route.get("/", authenticationroute, getPost);
route.patch("/:id", authenticationroute, upload.single("image"), updatePost);

// web get
route.get("/web", getPostWeb);
route.get("/web/topNews", getTopNewsWeb);
route.get("/web/all", getAllPostWeb);
route.get("/web/:id", getSinglePostWeb);
route.get("/category/", getAllCategoryPostWeb);
route.get("/web/category/:slug", getCategoryPostWeb);
route.get("/latest", getlatestNewsWeb);
route.get("/liveNews", getLiveNewsWeb);
route.get("/videoNews", geVideoNewsWeb);
route.get("/video/:id", geSingleVideoNewsWeb);
route.get("/popularPost", getPopularPosts);
route.get("/popularNews", getPopulerNewsWeb);

// export
module.exports = route;
