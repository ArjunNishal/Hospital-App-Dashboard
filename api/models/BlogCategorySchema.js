const mongoose = require("mongoose");
const BlogsCatSchema = new mongoose.Schema(
  {
    name: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    status: { type: Number, default: 1 },
    updatedby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);
const BlogCat = mongoose.model("BlogCat", BlogsCatSchema);
module.exports = BlogCat;
