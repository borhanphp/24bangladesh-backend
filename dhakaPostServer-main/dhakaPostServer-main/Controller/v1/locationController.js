const Division = require("../../Model/v1/divisionsModel");
const District = require("../../Model/v1/districtsModel");
const Upazila = require("../../Model/v1/upazillaModel");

async function getLocation(req, res) {
  try {
    const district = await District.find();
    const division = await Division.find();
    const upazila = await Upazila.find();

    return res.status(200).json({
      district,
      division,
      upazila,
      message: "All Location here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

module.exports = {
  getLocation,
};
