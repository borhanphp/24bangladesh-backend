const GeneralSetting = require("../../Model/v1/generalSettingModel");

const createNUpdateInfo = async (req, res) => {
  try {
    const {
      tagLine,
      websiteName,
      websiteTitle,
      metaDescription,
      facebook,
      youtube,
      whatsapps,
      twitterX,
      instagram,
      linkedIn,
      playStore,
      appsStore,
      googleNews,
      phone,
      mobile,
      email,
      address,
    } = req.body;

    const userId = req.user?._id || null;

    // Handle logo file
    const logo = req.file ? req.file.filename : null;

    // Check for existing setting
    const existingSetting = await GeneralSetting.findOne();

    if (existingSetting) {
      // Update fields
      if (logo) existingSetting.logo = logo;
      existingSetting.tagLine = tagLine;
      existingSetting.websiteName = websiteName;
      existingSetting.websiteTitle = websiteTitle;
      existingSetting.metaDescription = metaDescription;
      existingSetting.facebook = facebook;
      existingSetting.youtube = youtube;
      existingSetting.whatsapps = whatsapps;
      existingSetting.twitterX = twitterX;
      existingSetting.instagram = instagram;
      existingSetting.linkedIn = linkedIn;
      existingSetting.playStore = playStore;
      existingSetting.appsStore = appsStore;
      existingSetting.googleNews = googleNews;
      existingSetting.phone = phone;
      existingSetting.mobile = mobile;
      existingSetting.email = email;
      existingSetting.address = address;
      existingSetting.updatedBy = userId;

      const updated = await existingSetting.save();

      return res.status(200).json({
        message: "General setting updated successfully",
        data: updated,
      });
    } else {
      // Create new setting
      if (!logo) {
        return res
          .status(400)
          .json({ message: "Logo is required for creation" });
      }

      const newSetting = await GeneralSetting.create({
        tagLine,
        logo,
        websiteName,
        websiteTitle,
        websiteDescription,
        facebook,
        youtube,
        whatsApps,
        twitterX,
        instagram,
        linkedin,
        playStore,
        appsStore,
        googleNews,
        phone,
        mobile,
        email,
        address,
        createdBy: userId,
        updatedBy: userId,
      });

      return res.status(201).json({
        message: "General setting created successfully",
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
    const setting = await GeneralSetting.findOne()
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!setting) {
      return res.status(404).json({ message: "No general setting found" });
    }

    res.status(200).json({
      message: "General setting retrieved successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Error in getInfo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getInfo };

module.exports = {
  createNUpdateInfo,
  getInfo,
};
