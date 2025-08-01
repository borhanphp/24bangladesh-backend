const mongoose = require("mongoose");

const { Schema } = mongoose;

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      default: true,
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

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;
