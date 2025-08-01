const mongoose = require("mongoose");

const { Schema } = mongoose;

const footerSchema = new Schema(
  {
    details: {
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

const FooterSetting = mongoose.model("FooterSetting", footerSchema);
module.exports = FooterSetting;
