const mongoose = require("mongoose");

const { Schema } = mongoose;

const generalSettingSchema = new Schema(
  {
    // logo
    logo: {
      type: String,
      required: true,
    },
    // name for top Header
    websiteName: {
      type: String,
    },
    tagLine: {
      type: String,
    },
    websiteTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    // social
    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
    whatsapps: {
      type: String,
    },
    twitterX: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    playStore: {
      type: String,
    },
    appsStore: {
      type: String,
    },
    googleNews: {
      type: String,
    },
    // contact
    phone: {
      type: String,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    // trace information
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const GeneralSetting = mongoose.model("GeneralSetting", generalSettingSchema);
module.exports = GeneralSetting;
