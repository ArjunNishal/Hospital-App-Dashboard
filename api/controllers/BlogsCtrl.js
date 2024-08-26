const Blog = require("../models/BlogsSchema");
const BlogCat = require("../models/BlogCategorySchema");
const { pagination } = require("./pagination");
const fs = require("fs").promises;

// Category Controllers
exports.createCategory = async (req, res) => {
  try {
    const { name, admin } = req.body;

    const existing = await BlogCat.findOne({ name });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Category already exists with this name.",
      });
    }

    const newCategory = await BlogCat.create({ name, admin });
    res.status(201).json({
      status: true,
      message: "Category Created Successfully",
      newCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error occurred while creating category",
      error,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await BlogCat.findById(req.params.id);

    const existing = await BlogCat.findOne({
      name,
      // admin: category.admin,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Category already exists with this name.",
      });
    }

    const updatedCategory = await BlogCat.findByIdAndUpdate(
      req.params.id,
      { name, updatedby: req.realid },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "Category Updated Successfully",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error occurred while updating category",
      error,
    });
  }
};

exports.updateCategoryStatus = async (req, res) => {
  try {
    await BlogCat.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.status(200).json({ message: "Category status updated successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error occurred while updating category",
      error,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    let query = {};
    let populateOptions = { path: "admin", model: "Admin" };

    const categories = await pagination(
      BlogCat,
      BlogCat.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    // const categories = await BlogCat.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Categories fetched Successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error occurred while fetching category",
      error,
    });
  }
};

exports.getCategoriesByAdmin = async (req, res) => {
  try {
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    let query = { admin: req.params.adminId };
    let populateOptions = { path: "admin", model: "Admin" };

    const categories = await pagination(
      BlogCat,
      BlogCat.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    res.status(200).json({
      status: true,
      message: "Categories fetched Successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "error occurred while fetching category",
      error,
    });
  }
};

exports.getCategoriesByAdminwoPagination = async (req, res) => {
  try {
    let query = { status: 1 };
    let populateOptions = { path: "admin", model: "Admin" };

    const categories = await BlogCat.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Categories fetched Successfully",
      data: categories,
    });
  } catch (error) {
    console.log(error, "error in get blogs category for user");
    res.status(500).json({
      status: false,
      data: error,
      message: "error occurred while fetching category",
      error,
    });
  }
};

exports.getCategoriesAdmin = async (req, res) => {
  try {
    let query = { admin: req.params.adminId };
    let populateOptions = { path: "admin", model: "Admin" };

    const categories = await BlogCat.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Categories fetched Successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "error occurred while fetching category",
      error,
    });
  }
};

// Blog Controllers
exports.createBlog = async (req, res) => {
  try {
    const { category, title, content, admin, createdby, uploadedImages } =
      req.body;

    console.log(req.body, "req.body");

    const existing = await Blog.findOne({ title });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Blog already exists with this Title.",
      });
    }

    const image = req.file.filename; // Multer stores uploaded file details in req.file

    // Create new blog instance
    const newBlog = new Blog({
      category,
      title,
      content,
      image,
      admin: admin, // Assuming authenticated user is available in req.user
      createdby: createdby,
      updatedby: createdby,
      uploadedImages: JSON.parse(uploadedImages),
    });

    // Save the new blog
    await newBlog.save();

    res.status(201).json({
      status: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    console.log(req.body);
    const blogId = req.params.id;
    const { category, title, content, updatedby, imageurlsnew } = req.body;

    // const blog = await BlogCat.findById(req.params.id);
    const blog = await Blog.findById(blogId);

    const existing = await Blog.findOne({
      title,
      // admin: blog.admin,
      _id: { $ne: blogId },
    });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Blog already exists with this Title.",
      });
    }

    let updateData = { category, title, content, updatedby };
    let oldImage;

    updateData.updatesCount = blog.updatesCount + 1;

    const allOldImages = blog.uploadedImages;

    const regex = /src="([^"]*)"/g;
    const newurls = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
      newurls.push(match[1]);
    }

    updateData.uploadedImages = newurls;

    if (req.file) {
      // New image uploaded, so delete old image if it exists
      // const blog = await Blog.findById(blogId);
      if (blog.image) {
        oldImage = blog.image;
        const imagePath = `uploads/blogs/${blog.image}`;
        // Check if the old image file exists before attempting to delete it
        try {
          await fs.unlink(imagePath); // Delete old image from uploads folder
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      updateData.image = req.file.filename; // Update image with the new image filename
    }

    // Find the blog by ID and update
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      // If blog is not found
      return res.status(404).json({ message: "Blog not found" });
    }

    for (const oldImageUrl of allOldImages) {
      if (!newurls.includes(oldImageUrl)) {
        // Extract image name from URL
        console.log(oldImageUrl, " > oldImageUrl");
        const imageName = oldImageUrl.split("blogs/")[1];
        console.log(imageName, " > imageName");
        const imagePath = `uploads/blogs/${imageName}`;

        try {
          // Delete image file
          await fs.unlink(imagePath);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    }

    res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};

exports.updateBlogStatus = async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res
      .status(200)
      .json({ status: true, message: "Blog status updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    // const blogs = await Blog.find().sort({ createdAt: -1 });

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    // let query = { admin: req.params.adminId };
    let query = {};
    let populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "category", model: "BlogCat" },
      { path: "createdby", model: "Admin" },
      { path: "updatedby", model: "Admin" },
    ];

    const blogs = await pagination(
      Blog,
      Blog.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    res.status(200).json({ status: true, blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.getAllBlogswopagination = async (req, res) => {
  try {
    let query = { status: 1 };
    let populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "category", model: "BlogCat" },
      { path: "createdby", model: "Admin" },
      { path: "updatedby", model: "Admin" },
    ];

    const blogs = await Blog.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    res.status(200).send({
      status: true,
      data: blogs,
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", data: error });
  }
};

exports.getBlogsByAdmin = async (req, res) => {
  try {
    // const blogs = await Blog.find({ admin: req.params.adminId }).sort({
    //   createdAt: -1,
    // });
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    let query = { admin: req.params.adminId };
    // let query = {};
    let populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "category", model: "BlogCat" },
      { path: "createdby", model: "Admin" },
      { path: "updatedby", model: "Admin" },
    ];

    const blogs = await pagination(
      Blog,
      Blog.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    res.status(200).json({ status: true, blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Server Error", error });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.catid;

    // Check if category exists
    const category = await BlogCat.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find blogs by category
    // const blogs = await Blog.find({ category: categoryId }).populate(
    //   "category createdby admin updatedby likedby"
    // );

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    // let query = { admin: req.params.adminId };
    let query = { category: categoryId };
    let populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "category", model: "BlogCat" },
      { path: "createdby", model: "Admin" },
      { path: "updatedby", model: "Admin" },
      { path: "likedby", model: "Patient" },
    ];

    const blogs = await pagination(
      Blog,
      Blog.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    res.status(200).json({
      status: true,
      message: "blogs fetched successfully",
      category: category.name,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({
      message: "An error occurred while fetching blogs by category",
      error,
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId)
      .populate("category")
      .populate("admin")
      .populate("createdby")
      .populate("updatedby");

    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }
    // if (blog.status !== 1) {
    //   return res
    //     .status(404)
    //     .json({ status: false, message: "Blog is deactivated" });
    // }

    res.status(200).json({ status: true, message: "blog found", data: blog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", data: error });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user;

    // Find the blog by ID
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the user has already liked the blog
    const likedIndex = blog.likedby.indexOf(userId);

    if (likedIndex !== -1) {
      // User has already liked the blog, so dislike it
      blog.likedby.splice(likedIndex, 1);
      await blog.save();
      return res.status(200).json({
        status: true,
        message: "Blog disliked successfully",
        data: blog,
      });
    }

    // User has not liked the blog yet, so like it
    blog.likedby.push(userId);
    await blog.save();

    res.status(200).json({
      status: true,
      message: "Blog liked successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error liking the blog:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while liking the blog",
      error,
      data: error,
    });
  }
};

// Get all blogs liked by a patient
exports.getLikedBlogs = async (req, res) => {
  try {
    const userId = req.user;

    // Find all blogs liked by the user
    const likedBlogs = await Blog.find({ likedby: userId, status: 1 })
      .populate("category")
      .populate("admin", "username")
      .populate("createdby", "username")
      .populate("updatedby", "username");

    res.status(200).json({
      status: true,
      message: "Liked blogs fetched successfully",
      data: likedBlogs,
    });
  } catch (error) {
    console.error("Error fetching liked blogs:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching liked blogs",
      error,
      data: error,
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    // Access the uploaded file details
    const files = req.files;

    // if (!files || files.length === 0) {
    //   return res.status(400).json({ message: "No file uploaded" });
    // }

    // Construct the URL for accessing the uploaded image
    // const imageUrl = `${req.protocol}://${req.get("host")}/${file.path}`;
    const fileUrls = files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/blogs/${
        file.filename
      }`;
    });

    // Respond with the URL of the uploaded image
    res.json({ urls: fileUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


