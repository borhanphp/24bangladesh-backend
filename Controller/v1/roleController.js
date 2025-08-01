const Role = require("../../Model/v1/roleModel");

async function createRole(req, res) {
  try {
    const userId = req.user_id;
    const { name, accessPoint } = req.body;

    if (!name) {
      return res.status(300).json({
        message: "Name is required",
      });
    }
    if (accessPoint.length === 0 || accessPoint === false) {
      return res.status(400).json({
        message: " Access Point need any one",
      });
    }

    const newRole = new Role({
      name,
      accessPoint,
      createdBy: userId,
      updatedBy: null,
    });
    await newRole.save();

    return res.status(200).json({
      message: "Role Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function updateRole(req, res) {
  try {
    const userId = req.user_id;
    const { id } = req.params;
    const { name, accessPoint } = req.body;

    const role = await Role.findOne({ _id: id });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (name) {
      role.name = name;
    }

    // Update access Point
    if (accessPoint) {
      role.accessPoint = accessPoint;
    }

    role.updatedBy = userId;
    await role.save();

    return res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function allRole(req, res) {
  try {
    const role = await Role.find();

    return res.status(200).json({
      role,
      message: "All role here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

module.exports = {
  createRole,
  updateRole,
  allRole,
};
