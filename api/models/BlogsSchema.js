const mongoose = require("mongoose");
const BlogsSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCat" },
    title: { type: String },
    content: { type: String },
    image: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    likedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
    updatesCount: {
      type: Number,
      default: 0,
    },
    status: { type: Number, default: 1 },
    uploadedImages: [],
  },
  {
    timestamps: true,
  }
);
const Blog = mongoose.model("Blog", BlogsSchema);
module.exports = Blog;
