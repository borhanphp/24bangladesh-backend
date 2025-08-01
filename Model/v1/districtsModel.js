const mongoose = require("mongoose");

const { Schema } = mongoose;

const districtSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    division_id: {
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
    lat: {
      type: String,
      required: true,
    },
    long: {
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

const District = mongoose.model("District", districtSchema);
module.exports = District;
