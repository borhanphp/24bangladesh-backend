const Page = require("../../Model/v1/PageModel");

const createPage = async (req, res) => {
  try {
    const { title, slug, details, status } = req.body;
    const userId = req.user?._id || null;
    if (!slug || !title) {
      return res.status(400).json({ message: "Title and slug are required." });
    }
    const trimmedSlug = slug.trim();
    const newPage = await Page.create({
      title,
      slug: trimmedSlug,
      details,
      status,
      createdBy: userId,
      updatedBy: userId,
    });

    return res.status(201).json({
      message: "Page created successfully",
      data: newPage,
    });
  } catch (error) {
    console.error("createPage error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET /api/v1/page — Get all pages
const getPage = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: pages });
  } catch (error) {
    console.error("getPage error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// GET /api/v1/page/:slug — Get page by slug
const updatePagebySlug = async (req, res) => {
  try {
    const currentSlug = req.params.slug?.trim(); // the current slug in URL
    const userId = req.user?._id || null;

    if (!currentSlug) {
      return res.status(400).json({ message: "Slug is required." });
    }

    const page = await Page.findOne({ slug: currentSlug });

    if (!page) {
      return res.status(404).json({ message: "Page not found." });
    }

    const { title, details, slug: newSlug } = req.body;

    if (title) page.title = title;
    if (details) page.details = details;

    // only update slug if it's different
    if (newSlug && newSlug.trim() !== currentSlug) {
      const slugExists = await Page.findOne({ slug: newSlug.trim() });
      if (slugExists) {
        return res.status(400).json({ message: "New slug already exists." });
      }
      page.slug = newSlug.trim();
    }

    page.updatedBy = userId;

    const updatedPage = await page.save();

    return res.status(200).json({
      message: "Page updated successfully",
      data: updatedPage,
    });
  } catch (error) {
    console.error("updatePagebySlug error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPageBySlug = async (req, res) => {
  try {
    const slug = req.params.slug?.trim();

    if (!slug) {
      return res.status(400).json({ message: "Slug is required." });
    }

    const page = await Page.findOne({ slug });

    if (!page) {
      return res.status(404).json({ message: "Page not found." });
    }

    return res.status(200).json(page);
  } catch (error) {
    console.error("getPageBySlug error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  createPage,
  getPage,
  updatePagebySlug,
  getPageBySlug,
};
