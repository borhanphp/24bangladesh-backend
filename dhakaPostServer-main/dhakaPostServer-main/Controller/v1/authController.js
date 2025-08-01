const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../../Model/v1/userModel");

async function createUser(req, res) {
  try {
    const userId = req.user_id;
    const { fullName, email, password, role, division, district, subDistrict } =
      req.body;

    const image = req.file ? req.file.filename : null;

    if (!email || !password || !role) {
      return res.status(300).json({
        message: "All fields are required",
      });
    }
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(300).json({
        message: "Already Registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new Users({
      email,
      password: hash,
      role,
      userStatus: "active",
      cratedBy: userId || null,
      updatedBy: null,
      fullName,
      division,
      district,
      subDistrict,
      image,
    });
    await newUser.save();

    return res.status(200).json({
      message: "User Created successfuly",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    if (errmsg.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user_id;
    const { id } = req.params;
    const {
      email,
      password,
      role,
      userStatus,
      previousPassword,
      fullName,
      division,
      district,
      subDistrict,
    } = req.body;

    const image = req.file ? req.file.filename : null;
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;

    if (email) {
      const hasEmail = await Users.findOne({ email });
      if (hasEmail && hasEmail._id.toString() !== id) {
        return res.status(409).json({ message: "This email already exists!" });
      }
      user.email = email;
    }

    if (division) user.division = division;
    if (district) user.district = district;
    if (subDistrict) user.subDistrict = subDistrict;

    if (image) {
      user.image = image;
    }

    if (password) {
      if (!previousPassword) {
        return res
          .status(400)
          .json({ message: "Previous password is required" });
      }

      const isPasswordValid = await user.comparePassword(previousPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect previous password" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (role) user.role = role;
    if (userStatus) user.userStatus = userStatus;

    user.updatedBy = userId;
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (errmsg) {
    console.error("Error in updateUser:", errmsg);
    if (errmsg.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function allUser(req, res) {
  try {
    const user = await Users.find({ visible: true })
      .select("-password")
      .populate("role");
    return res.status(200).json({
      user,
      message: "All user here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function singleUser(req, res) {
  try {
    const userId = req.user_id;
    const user = await Users.findOne({ _id: userId }).select("-password");

    return res.status(200).json({
      user,
      message: "Your Information",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function signin(req, res) {
  const { email, password } = req.body;
  try {
    // 1st condition
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both Email and Password" });
    }
    // 2nd condition
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "This Email does not have any account !!",
      });
    }
    // 3rd condition
    if (user.userStatus === "inactive") {
      return res.status(402).json({
        message:
          "Your account is suspended. Please contact support your assistance.",
      });
    }

    // 4th condition
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Incorrect Password" });
    }
    // final response
    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Successfully Logged In !!",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Internal server error for Backend" });
  }
}

module.exports = {
  createUser,
  signin,
  updateUser,
  allUser,
  singleUser,
};
