const Category = require("../../Model/v1/categoryModel");

async function createCategory(req, res) {
  try {
    const userId = req.user_id;
    const { name, parentCategory, categoryImage, categorySlug } = req.body;
    if (!name) {
      return res.status(300).json({
        message: "Category Name is required",
      });
    }
    const newCategory = new Category({
      name,
      parentCategory: parentCategory || null,
      categoryImage,
      categorySlug,
      createdBy: userId,
      updatedBy: null,
    });
    await newCategory.save();
    return res.status(200).json({
      message: "Category Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getCategory(req, res) {
  try {
    const categorys = await Category.find()
      .populate("parentCategory", "name _id")
      .populate("createdBy", "name _id");

    return res.status(200).json({
      categorys,
      message: "All Category here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function updateCategory(req, res) {
  try {
    const userId = req.user_id;
    const { id } = req.params; // Category ID from URL

    const { name, parentCategory, categoryImage, categorySlug } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update fields if provided
    if (name) category.name = name;
    if (parentCategory !== undefined)
      category.parentCategory = parentCategory || null;
    if (categoryImage !== undefined) category.categoryImage = categoryImage;
    if (categorySlug !== undefined) category.categorySlug = categorySlug;

    category.updatedBy = userId;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (errmsg) {
    console.error("Error updating category:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
};
