// require
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const env = require("dotenv").config();

// enverment variable
const PORT = process.env.PORT || 8586;
const databaseUrl = process.env.DATABASE_URL;

// module
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true, // Dynamically allows the request's origin
    credentials: true, // Allows cookies & auth headers
  })
);

app.use("/upload", express.static(path.join(__dirname, "upload")));

const apiRoutes = require("./router");
app.use("/v1/api", apiRoutes);

const apiWbebRoutes = require("./Webrouter");
app.use("/v1/api/web", apiWbebRoutes);

// testing and error tesing api
app.get("/v1", function (req, res) {
  res.set("content-Type", "text/html; charset=utf-8");
  res.send("<h1>Apps is running</h1>");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// server code
app.listen(PORT, () => {
  mongoose
    .connect(databaseUrl)
    .then(() => {
      console.log("Database Connected");
      console.log(`App is Running PORT = http://localhost:${PORT}`);
    })
    .catch((err) => {
      console.log("Error occurs from Databse Connetion");
      console.log(err);
    });
});
