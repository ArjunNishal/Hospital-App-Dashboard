const mongoose = require("mongoose");
const weekmasterschema = new mongoose.Schema(
  {
    name: { type: String },
    status: { type: Number, default: 1 },
    updatedby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);
const WeekMaster = mongoose.model("WeekMaster", weekmasterschema);
module.exports = WeekMaster;
