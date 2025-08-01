const FooterSetting = require("../../Model/v1/FooterModel");

const createNUpdateInfo = async (req, res) => {
  try {
    const { details } = req.body;

    const userId = req.user?._id || null;

    const existingSetting = await FooterSetting.findOne();

    if (existingSetting) {
      existingSetting.details = details;
      const updated = await existingSetting.save();
      return res.status(200).json({
        message: "Footer updated successfully",
        data: updated,
      });
    } else {
      const newSetting = await FooterSetting.create({
        userId,
        createdBy: userId,
        updatedBy: userId,
      });

      return res.status(201).json({
        message: "Footer created successfully",
        data: newSetting,
      });
    }
  } catch (error) {
    console.error("createNUpdateInfo error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getInfo = async (req, res) => {
  try {
    const setting = await FooterSetting.findOne()
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!setting) {
      return res.status(404).json({ message: "No setting found" });
    }

    res.status(200).json({
      message: "setting retrieved successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Error in getInfo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createNUpdateInfo,
  getInfo,
};
