const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Function to create multer upload configuration
const createMulterUpload = (uploadPath, fields) => {
  return (req, res, next) => {
    try {
      const reqClient = req.client;

      // Define the folder path for the client
      const clientFolder = path.join(uploadPath || 'uploads', reqClient);

      // Create the folder if it does not exist
      if (!fs.existsSync(clientFolder)) {
        fs.mkdirSync(clientFolder, { recursive: true });
      }

      // Define storage configuration for multer
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, clientFolder); // Set destination to the client folder
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const sanitizedFilename = file.originalname.replace(/\s+/g, '-');
          cb(null, `${timestamp}-${sanitizedFilename}`); // Generate a unique filename
        },
      });

      // Initialize multer with the storage configuration and fields
      const upload = multer({ storage }).fields(fields);

      // Handle the upload
      upload(req, res, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ message: 'File upload failed', error: err.message });
        }
        next(); // Proceed to the next middleware (e.g., category creation)
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Server Error', error: error.message });
    }
  };
};

module.exports = createMulterUpload;
