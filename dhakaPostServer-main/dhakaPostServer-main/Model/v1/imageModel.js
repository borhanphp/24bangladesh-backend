const mongoose = require("mongoose");

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    fontStatus: {
      type: String,
      default: false,
    },
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

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
