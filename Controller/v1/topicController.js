const Topic = require("../../Model/v1/TopicModel");
const News = require("../../Model/v1/newsModel");

async function createTopic(req, res) {
  try {
    const userId = req.user_id;

    const { name, details, topicSlug, parentCategory } = req.body;

    if (!name || !topicSlug) {
      return res.status(300).json({
        message: "Slug is required",
      });
    }

    const newTopic = new Topic({
      name,
      topicSlug,
      details,
      parentCategory,
      createdBy: userId,
      updatedBy: null,
    });
    await newTopic.save();

    return res.status(200).json({
      message: "Topic Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getTopic(req, res) {
  try {
    const categorys = await Topic.find().populate("parentCategory", "name _id");

    return res.status(200).json({
      categorys,
      message: "All Category here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

const updateTopic = async (req, res) => {
  try {
    const userId = req.user_id;
    const { id } = req.params;
    const { name, topicSlug, parentCategory, details } = req.body;

    if (!name || !topicSlug) {
      return res.status(400).json({
        message: "Name and Slug are required",
      });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      {
        name,
        topicSlug,
        details,
        parentCategory,
        updatedBy: userId,
      },
      {
        new: true, // return the updated document
        runValidators: true,
      }
    );

    if (!updatedTopic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      message: "Topic updated successfully",
      updatedTopic,
    });
  } catch (errmsg) {
    console.error("Update Topic Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getNewsByTopicSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // 1. Find topic by slug
    const topic = await Topic.findOne({ topicSlug: slug });
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // 2. Find news where topicList includes the topic's _id
    const newsList = await News.find({
      topicList: topic._id,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("topicList", "name topicSlug")
      .populate("categoryList", "name categorySlug")
      .populate("reporters", "name");

    return res.status(200).json({
      topic: {
        _id: topic._id,
        name: topic.name,
        topicSlug: topic.topicSlug,
        details: topic.details,
      },
      news: newsList,
    });
  } catch (error) {
    console.error("getNewsByTopicSlug error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createTopic,
  getTopic,
  updateTopic,
  getNewsByTopicSlug,
};
