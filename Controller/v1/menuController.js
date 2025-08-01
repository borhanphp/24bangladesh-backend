const Menu = require("../../Model/v1/menuModel");

async function createMenu(req, res) {
  try {
    const userId = req.user_id;
    const { name, idNumber, category } = req.body;

    if (!name || !idNumber || !category) {
      return res.status(300).json({
        message: "Id, Name and Category are required",
      });
    }

    const newMenu = new Menu({
      name,
      idNumber,
      category,
      createdBy: userId,
      updatedBy: null,
    });
    await newMenu.save();

    return res.status(200).json({
      message: "Menu Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getMenu(req, res) {
  try {
    const allMenu = await Menu.find().populate("category.categoryId", "name");

    return res.status(200).json({
      allMenu,
      message: "All Menu here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
async function updateMenu(req, res) {
  try {
    const userId = req.user_id;
    const menuId = req.params.id;
    const { name, idNumber, category } = req.body;

    if (!name && !idNumber && !category) {
      return res.status(400).json({
        message:
          "At least one field (name, idNumber, category) must be provided to update.",
      });
    }

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (name) menu.name = name;
    if (idNumber) menu.idNumber = idNumber;
    if (category) menu.category = category;

    menu.updatedBy = userId;

    await menu.save();

    return res.status(200).json({ message: "Menu updated successfully" });
  } catch (err) {
    console.error("Update menu error:", err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getWebNavigation(req, res) {
  try {
    const menus = await Menu.find()
      .populate("category.categoryId", "name categorySlug parentCategory")
      .sort({ name: 1 });

    const navigation = [];

    for (const menu of menus) {
      const allCategories = new Map(); // key = _id, value = category object

      // First pass: collect all
      for (const cat of menu.category) {
        const catData = cat.categoryId;
        if (!catData) continue;

        const categoryObj = {
          _id: catData._id,
          name: catData.name,
          categorySlug: catData.categorySlug,
          order: cat.order,
          parentCategory: catData.parentCategory?.toString() || null,
        };

        allCategories.set(catData._id.toString(), categoryObj);
      }

      const categoriesMap = new Map();

      // Second pass: build hierarchy
      for (const [id, cat] of allCategories) {
        if (cat.parentCategory) {
          const parent = allCategories.get(cat.parentCategory);
          if (parent) {
            if (!parent.subCategories) parent.subCategories = [];
            parent.subCategories.push(cat);
          }
        } else {
          categoriesMap.set(id, cat);
        }
      }

      // Sort main categories and their subcategories
      const categories = Array.from(categoriesMap.values())
        .sort((a, b) => a.order - b.order)
        .map((cat) => ({
          ...cat,
          subCategories:
            cat.subCategories?.sort((a, b) => a.order - b.order) || [],
        }));

      navigation.push({
        _id: menu._id,
        name: menu.name,
        idNumber: menu.idNumber,
        categories,
      });
    }

    return res.status(200).json({
      navigation,
      message: "Web navigation menus fetched successfully",
    });
  } catch (error) {
    console.error("Web navigation error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createMenu,
  getMenu,
  updateMenu,
  getWebNavigation,
};
