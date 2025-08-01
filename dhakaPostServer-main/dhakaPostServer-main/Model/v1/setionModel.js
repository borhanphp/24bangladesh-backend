const mongoose = require("mongoose");

const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
    idNumber: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
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

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
