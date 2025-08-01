const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
    },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
    subDistrict: {
      type: Schema.Types.ObjectId,
      ref: "Upazila",
    },
    fullName: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    userStatus: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
