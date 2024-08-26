const express = require("express");
const router = express.Router();
const blogController = require("../controllers/BlogsCtrl");
const multer = require("multer");

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/blogs/"); // Save uploaded images to the uploads folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/blogs/"); // Save uploaded images to the uploads folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload2 = multer({ storage: storage2 });

// Category Routes
router.post("/create/category", blogController.createCategory);
router.put("/edit/category/:id", blogController.updateCategory);
router.put("/edit/category/:id/status", blogController.updateCategoryStatus);
router.get("/get/categories", blogController.getAllCategories);
router.get(
  "/get/categories/admin/:adminId",
  blogController.getCategoriesByAdmin
);

router.get("/getcategories/:adminId", blogController.getCategoriesAdmin);

// Blog Routes
router.post("/create/blog", upload.single("image"), blogController.createBlog);
router.put("/edit/blog/:id", upload.single("image"), blogController.updateBlog);
router.put("/edit/blog/:id/status", blogController.updateBlogStatus);
router.get("/get/blogs", blogController.getAllBlogs);
router.get("/get/blogs/admin/:adminId", blogController.getBlogsByAdmin);
router.get("/get/blogsbycat/admin/:catid", blogController.getBlogsByCategory);
router.get("/getblog/:id", blogController.getBlogById);
router.post(
  "/upload/image",
  // upload.single("upload"),
  upload2.array("files"),
  blogController.uploadImage
);

module.exports = router;
