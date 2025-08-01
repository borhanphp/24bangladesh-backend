const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    categoryList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    topicList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    reltedPostId: {
      type: [String],
    },
    reporters: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    image: {
      type: String,
    },
    topics: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },
    topNews: {
      type: Boolean,
      default: true,
    },
    leadNews: {
      type: Boolean,
      default: true,
    },
    liveNews: {
      type: Boolean,
      default: true,
    },
    categoryPin: {
      type: Boolean,
      default: true,
    },
    discription: {
      type: String,
    },
    metaTitle: {
      type: String,
    },
    metaDiscription: {
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
    upazila: {
      type: Schema.Types.ObjectId,
      ref: "Upazila",
    },
    status: {
      type: String,
      default: "active",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    visitor: {
      type: Number,
      default: 0,
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

const News = mongoose.model("News", newsSchema);
module.exports = News;
