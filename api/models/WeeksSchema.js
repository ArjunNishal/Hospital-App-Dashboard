const mongoose = require("mongoose");
const WeekSchema = new mongoose.Schema(
  {
    week: { type: mongoose.Schema.Types.ObjectId, ref: "WeekMaster" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    status: { type: Number, default: 1 },
    relatedblogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    baby: {
      image: { type: String },
      title: { type: String },
      length: { type: String },
      weight: { type: String },
      size: { type: String },
      description: { type: String },
      babyuploadedimages: [],
    },
    mom: {
      image: { type: String },
      description: { type: String },
      MomuploadedImages: [],
    },
    tip: {
      symptoms: { type: String },
      symptomsUploadedImages: [],
      lifestyle: { type: String },
      lifecycleuploadedImages: [],
      sex: { type: String },
      sexUploadedImages: [],
    },
  },
  {
    timestamps: true,
  }
);
const Week = mongoose.model("Week", WeekSchema);
module.exports = Week;
