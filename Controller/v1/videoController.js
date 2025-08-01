const Video = require("../../Model/v1/videoModel");

function generateUniqueId(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createVideo(req, res) {
  try {
    const userId = req.user_id;
    const { title, videoURL, discription, topic } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!title || !videoURL) {
      return res.status(300).json({
        message: "Title  and Video URL are required",
      });
    }

    const newVideo = new Video({
      postId: generateUniqueId(),
      image,
      title,
      topic,
      videoURL,
      discription,
      createdBy: userId,
      updatedBy: null,
    });
    await newVideo.save();

    return res.status(200).json({
      message: "Video Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getVideo(req, res) {
  try {
    const allVideos = await Video.find().populate("topic", "name _id");

    return res.status(200).json({
      allVideos,
      message: "All Video here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user_id;
    const { title, videoURL, discription, topic } = req.body;

    const image = req.file ? req.file.filename : undefined;

    // Validate required fields
    if (!title || !videoURL) {
      return res.status(400).json({
        message: "Title and Video URL are required",
      });
    }

    const updateFields = {
      title,
      videoURL,
      discription,
      topic,
      updatedBy: userId,
    };

    // Only include image if new file was uploaded
    if (image) {
      updateFields.image = image;
    }

    const updatedVideo = await Video.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({
      updatedVideo,
      message: "Video updated successfully",
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Failed to update video" });
  }
};

module.exports = {
  createVideo,
  getVideo,
  updateVideo,
};
