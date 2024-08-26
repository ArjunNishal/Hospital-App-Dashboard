const mongoose = require("mongoose");

const NoteDiarySchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    content: {
      type: String,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  {
    timestamps: true,
  }
);

const NoteDiary = mongoose.model("NoteDiary", NoteDiarySchema);
module.exports = NoteDiary;
