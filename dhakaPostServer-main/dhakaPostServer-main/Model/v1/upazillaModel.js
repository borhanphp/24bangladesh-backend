const mongoose = require("mongoose");

const { Schema } = mongoose;

const upazillaSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    district_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bn_name: {
      type: String,
      required: true,
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

const Upazila = mongoose.model("Upazila", upazillaSchema);
module.exports = Upazila;
