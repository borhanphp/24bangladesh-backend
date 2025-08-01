const Section = require("../../Model/v1/setionModel");

async function createSection(req, res) {
  try {
    const userId = req.user_id;
    const { idNumber, category } = req.body;

    if (!idNumber || !category) {
      return res.status(300).json({
        message: "Id and Category are required",
      });
    }

    const newSection = new Section({
      idNumber,
      category,
      createdBy: userId,
      updatedBy: null,
    });
    await newSection.save();

    return res.status(200).json({
      message: "Section Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getSection(req, res) {
  try {
    const allSection = await Section.find().populate("category");

    return res.status(200).json({
      allSection,
      message: "All Section here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
async function updateSection(req, res) {
  try {
    const userId = req.user_id;
    const { id } = req.params;
    const { idNumber, category } = req.body;

    // Check if section exists
    const section = await Section.findById(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Update fields if provided
    if (idNumber) {
      section.idNumber = idNumber;
    }

    if (category) {
      section.category = category;
    }

    section.updatedBy = userId;

    await section.save();

    return res.status(200).json({
      message: "Section updated successfully",
      section,
    });
  } catch (errmsg) {
    console.error("Error updating section:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

module.exports = {
  createSection,
  getSection,
  updateSection,
};
