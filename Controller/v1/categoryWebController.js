const Category = require("../../Model/v1/categoryModel");

async function getCategoriesWeb(req, res) {
  try {
    const categories = await Category.find()
      .sort({ name: 1 })
      .select("name categorySlug _id")
      .lean();

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("getCategoriesWeb error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = { getCategoriesWeb };


