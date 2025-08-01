const navItem = require("../../data/Nav.json");

async function getNav(req, res) {
  try {
    // const navList = await navItem.find();

    return res.status(200).json({
      navItem,
      message: "All nav",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

module.exports = {
  getNav,
};
