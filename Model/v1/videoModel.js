const mongoose = require("mongoose");

const { Schema } = mongoose;

const videoSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
      required: true,
    },
    topic: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    discription: {
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

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
