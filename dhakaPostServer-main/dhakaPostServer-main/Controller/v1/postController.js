const News = require("../../Model/v1/newsModel");
const Category = require("../../Model/v1/categoryModel");
const Section = require("../../Model/v1/setionModel");
const Video = require("../../Model/v1/videoModel");
const Topic = require("../../Model/v1/TopicModel");

function generateUniqueId(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
async function createPost(req, res) {
  try {
    const userId = req.user_id;
    const {
      topNews,
      topicList,
      title,
      subTitle,
      categoryList,
      reltedPostId,
      reporters,
      topics,
      leadNews,
      liveNews,
      categoryPin,
      discription,
      metaTitle,
      metaDiscription,
      division,
      district,
      upazila,
      status,
      publishDate,
    } = req.body;

    if (!title || !categoryList) {
      return res.status(300).json({
        message: "Title Name is required",
      });
    }

    const image = req.file ? req.file.filename : null;

    const newNews = new News({
      postId: generateUniqueId(),
      topNews,
      topicList,
      title,
      subTitle,
      categoryList,
      reltedPostId,
      reporters,
      image,
      topics,
      leadNews,
      liveNews,
      categoryPin,
      discription,
      metaTitle,
      metaDiscription,
      division,
      district,
      upazila,
      status: status || "active",
      publishDate,
      createdBy: userId,
      updatedBy: null,
    });
    await newNews.save();

    return res.status(200).json({
      message: "News Created successfuly",
    });
  } catch (errmsg) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
async function getPost(req, res) {
  try {
    const news = await News.find({ status: "active" }).populate("categoryList");

    return res.status(200).json({
      news,
      message: "All Category here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
async function updatePost(req, res) {
  try {
    const userId = req.user_id;
    const { id } = req.params;

    const {
      topNews,
      topicList,
      title,
      subTitle,
      categoryList,
      reltedPostId,
      reporters,
      topics,
      leadNews,
      liveNews,
      categoryPin,
      discription,
      metaTitle,
      metaDiscription,
      division,
      district,
      upazila,
      status,
      publishDate,
    } = req.body;

    // Find existing news post
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Optional: Replace image if new file provided
    const image = req.file ? req.file.filename : news.image;

    // Required validation
    // if (!title || !categoryList) {
    //   return res
    //     .status(400)
    //     .json({ message: "Title and Category are required" });
    // }

    // Update fields
    if (title !== undefined) news.title = title;
    if (subTitle !== undefined) news.subTitle = subTitle;
    if (categoryList !== undefined) news.categoryList = categoryList;
    if (topicList !== undefined) news.topicList = topicList;
    if (reltedPostId !== undefined) news.reltedPostId = reltedPostId;
    if (reporters !== undefined) news.reporters = reporters;
    if (topics !== undefined) news.topics = topics;
    if (leadNews !== undefined) news.leadNews = leadNews;
    if (liveNews !== undefined) news.liveNews = liveNews;
    if (categoryPin !== undefined) news.categoryPin = categoryPin;
    if (discription !== undefined) news.discription = discription;
    if (metaTitle !== undefined) news.metaTitle = metaTitle;
    if (metaDiscription !== undefined) news.metaDiscription = metaDiscription;
    if (division !== undefined) news.division = division;
    if (district !== undefined) news.district = district;
    if (upazila !== undefined) news.upazila = upazila;
    if (status !== undefined) news.status = status;
    if (publishDate !== undefined) news.publishDate = publishDate;
    if (image !== undefined) news.image = image;
    if (topNews !== undefined) news.topNews = topNews;

    news.updatedBy = userId;

    await news.save();

    return res.status(200).json({ message: "News updated successfully", news });
  } catch (errmsg) {
    console.error("Error in updatePost:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

// web get
async function getTopNewsWeb(req, res) {
  try {
    let leadNews = await News.findOne({
      status: "active",
      leadNews: true,
    })
      .sort({ createdAt: -1, _id: -1 })
      .populate("categoryList", "name slug")
      .populate("reporters", "name profilePicture")
      .lean();
    if (!leadNews) {
      leadNews = await News.findOne({ status: "active" })
        .sort({ createdAt: -1, _id: -1 })
        .populate("categoryList", "name slug")
        .populate("reporters", "name profilePicture")
        .lean();
    }
    const latestNewsQuery = { status: "active", topNews: true };
    if (leadNews?._id) {
      latestNewsQuery._id = { $ne: leadNews._id };
    }
    const latestNews = await News.find(latestNewsQuery)
      .sort({ createdAt: -1, _id: -1 })
      .limit(8)
      .populate("categoryList", "name slug")
      .populate("reporters", "name profilePicture")
      .lean();

    return res.status(200).json({
      leadNews,
      latestNews,
      message: "All Top News here",
    });
  } catch (error) {
    console.error("Error in getPostWeb:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
async function getPostWeb(req, res) {
  try {
    const sectionInfo = await Section.find()
      .select("name idNumber category")
      .populate("category", "name");
    const sections = await Section.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "news",
          let: { categoryId: "$category._id" },
          pipeline: [
            {
              $match: {
                status: "active",
                categoryPin: true, // <-- add this condition here
                $expr: { $in: ["$$categoryId", "$categoryList"] },
              },
            },
            { $sort: { createdAt: -1, _id: -1 } },
            { $limit: 7 },
            {
              $lookup: {
                from: "reporters",
                localField: "reporters",
                foreignField: "_id",
                as: "reporters",
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "categoryList",
                foreignField: "_id",
                as: "categoryList",
              },
            },
            {
              $project: {
                title: 1,
                subTitle: 1,
                categoryList: { name: 1, slug: 1 },
                image: 1,
                postId: 1,
                categoryPin: 1,
                discription: 1,
                createdAt: 1,
                reporters: { name: 1, profilePicture: 1 },
              },
            },
          ],
          as: "news",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          category: { name: 1, slug: 1 },
          news: 1,
        },
      },
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: {
            idNumber: {
              $documentNumber: {},
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      sectionInfo,
      sections,
      message: "All categories here",
    });
  } catch (error) {
    console.error("Error in getPostWeb:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getSinglePostWeb(req, res) {
  const { id } = req.params;

  try {
    // Step 1: Find the news post and increment its visitor count
    const news = await News.findOneAndUpdate(
      { postId: id, status: "active" },
      { $inc: { visitor: 1 } },
      {
        new: true,
        upsert: false,
      }
    )
      .populate({
        path: "reporters",
        select: "-password -__v",
        populate: {
          path: "role",
          select: "-__v",
        },
      })
      .populate("categoryList", "name slug")
      .populate("topicList", "name topicSlug")
      .select("-__v");

    if (!news) {
      return res.status(404).json({ message: "No post found" });
    }

    // Step 2: Try to find related news (by same category or topic)
    let relatedNews = await News.find({
      status: "active",
      postId: { $ne: id },
      $or: [
        { categoryList: { $in: news.categoryList.map((c) => c._id) } },
        { topicList: { $in: news.topicList.map((t) => t._id) } },
      ],
    })
      .limit(4)
      .select("title postId thumbnail createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Step 3: If no related news, fallback to random news from same category
    if (!relatedNews || relatedNews.length === 0) {
      relatedNews = await News.aggregate([
        {
          $match: {
            status: "active",
            postId: { $ne: id },
            categoryList: { $in: news.categoryList.map((c) => c._id) },
          },
        },
        { $sample: { size: 4 } },
        {
          $project: {
            title: 1,
            postId: 1,
            thumbnail: 1,
            createdAt: 1,
          },
        },
      ]);
    }

    // Step 4: Get random news for sidebar/footer/etc.
    const randomNews = await News.aggregate([
      {
        $match: {
          status: "active",
          postId: { $ne: id },
        },
      },
      { $sample: { size: 15 } },
      {
        $project: {
          title: 1,
          postId: 1,
          thumbnail: 1,
          createdAt: 1,
          image: 1,
        },
      },
    ]);

    // Step 5: Return full response
    return res.status(200).json({
      news,
      relatedNews,
      randomNews,
      message: "Post, related, and random news retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getSinglePostWeb:", err.message || err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

async function getAllPostWeb(req, res) {
  try {
    const news = await News.find({ status: "active" });
    return res.status(200).json({
      news,
      message: "All News here",
    });
  } catch (errmsg) {
    console.error("Error:", errmsg);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}
const getCategoryPostWeb = async (req, res) => {
  try {
    const { slug } = req.params;
    const postLimit = parseInt(req.query.limit) || 11;

    // 1. Find the category by slug
    const category = await Category.findOne({ categorySlug: slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Fetch posts with that category
    const posts = await News.find({
      categoryList: category._id,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .limit(postLimit)
      .populate("categoryList", "name categorySlug");

    // 3. Fetch all topics under this category
    const topics = await Topic.find({
      parentCategory: category._id,
    }).select("name topicSlug");

    return res.status(200).json({
      category: {
        _id: category._id,
        name: category.name,
        categorySlug: category.categorySlug,
      },
      posts,
      topics,
    });
  } catch (error) {
    console.error("getCategoryPostWeb error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const getAllCategoryPostWeb = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const result = await Promise.all(
      categories.map(async (category) => {
        const posts = await News.find({
          categoryList: category._id,
          status: "active",
        })
          .sort({ createdAt: -1 })
          .limit(11)
          .select("title image postId publishDate") // only needed fields
          .lean(); // returns plain JS object

        return {
          _id: category._id,
          name: category.name,
          categorySlug: category.categorySlug,
          posts,
        };
      })
    );

    return res.status(200).json({ categories: result });
  } catch (error) {
    console.error("getAllCategoryPostWeb error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getlatestNewsWeb = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 12;
    const latestNews = await News.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("categoryList", "name categorySlug");

    res.status(200).json({ news: latestNews });
  } catch (error) {
    console.error("getLatestNewsWeb error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const getLiveNewsWeb = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 5) || 5;
    const liveNews = await News.find({ status: "active", liveNews: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("postId title");

    res.status(200).json({ news: liveNews });
  } catch (error) {
    console.error("getLatestNewsWeb error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const geVideoNewsWeb = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;

    const videoNews = await Video.find().sort({ createdAt: -1 }).limit(limit);

    res.status(200).json({ news: videoNews });
  } catch (error) {
    console.error("geVideoNewsWeb error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
const geSingleVideoNewsWeb = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const video = await Video.findOne({ postId: id });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ video });
  } catch (error) {
    console.error("geSingleVideoNewsWeb error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
async function getPopularPosts(req, res) {
  try {
    // Step 1: Get posts with 'visitor' field, sorted by highest visitors
    const popularPosts = await News.find({
      status: "active",
      visitor: { $exists: true },
    })
      .sort({ visitor: -1 })
      .limit(10)
      .select("title postId visitor image"); // Add more fields if needed

    const popularCount = popularPosts.length;

    // Step 2: If fewer than 10, get the rest randomly from posts without visitor field
    let additionalPosts = [];
    if (popularCount < 10) {
      additionalPosts = await News.aggregate([
        {
          $match: {
            status: "active",
            visitor: { $exists: false }, // Only those that don't have visitor field
          },
        },
        { $sample: { size: 10 - popularCount } },
        {
          $project: {
            title: 1,
            postId: 1,
            visitor: 1,
            image: 1,
          },
        },
      ]);
    }

    // Step 3: Combine popular + random and return
    const finalPosts = [...popularPosts, ...additionalPosts];

    return res.status(200).json({
      data: finalPosts,
      message: "Top 10 posts (by popularity or random) retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getPopularPosts:", err);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

const getPopulerNewsWeb = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 12;

    // Step 1: Get popular news (those with visitor field), sorted by visitor count
    const popularNews = await News.find({
      status: "active",
      visitor: { $exists: true },
    })
      .sort({ visitor: -1 })
      .limit(limit)
      .populate("categoryList", "name categorySlug");

    const popularCount = popularNews.length;

    // Step 2: If less than limit, get the remaining from random active posts without visitor
    let additionalNews = [];
    if (popularCount < limit) {
      additionalNews = await News.aggregate([
        {
          $match: {
            status: "active",
            visitor: { $exists: false },
          },
        },
        { $sample: { size: limit - popularCount } },
        {
          $project: {
            _id: 1,
            title: 1,
            postId: 1,
            categoryList: 1,
            createdAt: 1,
            visitor: 1,
            image: 1,
            discription: 1,
          },
        },
      ]);
    }

    const mergedNews = [...popularNews, ...additionalNews];

    res.status(200).json({ news: mergedNews });
  } catch (error) {
    console.error("getPopulerNewsWeb error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getTopNewsWeb,
  createPost,
  getPost,
  updatePost,
  getPostWeb,
  getSinglePostWeb,
  getAllPostWeb,
  getCategoryPostWeb,
  getAllCategoryPostWeb,
  getlatestNewsWeb,
  getLiveNewsWeb,
  geVideoNewsWeb,
  geSingleVideoNewsWeb,
  getPopularPosts,
  getPopulerNewsWeb,
};
