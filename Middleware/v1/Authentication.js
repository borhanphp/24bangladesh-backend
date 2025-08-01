const jwt = require("jsonwebtoken");
const Users = require("../../Model/v1/userModel");
const navItem = require("../../data/Nav.json");
// const Customer = require("../../Model/CustomerModel");

// this middleware authonticate for user validation
const authentication = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id: decoded.user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = {
      user: user,
      navItem: navItem,
      message: "Authentication successful",
    };
    res.status(200).json(response);
    return next();
  } catch (error) {
    return res.status(400).json({ message: "Authentication failed" });
  }
};
// this middleware for news admin
const authenticationroute = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userVarify = await Users.findOne({ _id: decoded.user_id });
    if (!userVarify) {
      return res.status(404).json({ message: "Unauthorized !!" });
    }
    req.user_id = decoded.user_id;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Authentication failed" });
  }
};

const authenticationrouteForWeb = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.webtoken;
    if (!authorizationHeader) {
      return res.status(202).json({ message: "Web Token missing" });
    }
    const client = await Client.findOne({ clientId: authorizationHeader });
    if (!client) {
      return res.status(206).json({ message: "Un-authorization Request" });
    }
    req.client = client.clientId;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Authentication failed" });
  }
};

const allowedDomains = [
  "https://24bangladesh.net/",
  "http://24bangladesh.net/",
  "http://24bangladesh.net/",
  "https://admin.24bangladesh.net/",
  "http://localhost:3000",
  "http://localhost:3001",
];

const webMiddleware = async (req, res, next) => {
  try {
    const origin = req.headers.origin || req.headers.referer;

    if (
      !origin ||
      !allowedDomains.some((domain) => origin.startsWith(domain))
    ) {
      return res
        .status(403)
        .json({ message: "Access from this domain is not allowed" });
    }

    // Only domain is verified
    next();
  } catch (error) {
    return res.status(400).json({ message: "Domain validation failed" });
  }
};

module.exports = {
  authentication,
  authenticationroute,
  authenticationrouteForWeb,
  webMiddleware,
};
