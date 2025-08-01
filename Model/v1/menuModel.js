const mongoose = require("mongoose");

const { Schema } = mongoose;

const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    category: [
      {
        categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
        order: { type: Number },
      },
    ],
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

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
