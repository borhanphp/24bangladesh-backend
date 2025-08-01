const Image = require("../../Model/v1/imageModel");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "..", "..", "upload");

const createImage = async (req, res) => {
  try {
    const userId = req.user_id;
    const fontStatus = req.body.fontStatus || null;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imagePath = req.file.filename;

    const newImage = new Image({
      image: imagePath, // save filename or full URL
      fontStatus,
      createdBy: userId,
      updatedBy: null,
    });

    await newImage.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      image: imagePath,
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

async function getImage(req, res) {
  try {
    const allImage = await Image.find();

    return res.status(200).json({
      allImage,
      message: "All image here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedImage = await Image.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getImageformFolder = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Error reading upload folder:", err.message);
      return res.status(500).json({
        message: "Unable to read upload directory",
        error: err.message,
      });
    }

    const imageFiles = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file))
      .sort((a, b) => {
        const aTime = fs.statSync(path.join(uploadDir, a)).mtime.getTime();
        const bTime = fs.statSync(path.join(uploadDir, b)).mtime.getTime();
        return bTime - aTime; // descending by modified time
      });

    const imageUrls = imageFiles.map(
      (file) => `${req.protocol}://${req.get("host")}/upload/${file}`
    );

    res.status(200).json({ images: imageUrls });
  });
};

const deleteImageFromFolder = (req, res) => {
  const { filename } = req.params; // get filename from params

  if (filename.includes("/")) {
    filename = filename.split("/").pop();
  }

  if (!filename) {
    return res.status(400).json({ message: "Filename is required" });
  }

  const filePath = path.join(uploadDir, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Image not found" });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error deleting image", error: err.message });
      }

      res.status(200).json({ message: "Image deleted successfully" });
    });
  });
};

module.exports = {
  createImage,
  getImage,
  deleteImage,
  getImageformFolder,
  deleteImageFromFolder,
};
