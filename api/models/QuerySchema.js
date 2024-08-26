const mongoose = require("mongoose");
const queryschema = new mongoose.Schema(
  {
    name: { type: String },
    message: { type: String },
    phone: { type: String },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedby: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    status: { type: Number, default: 2 },
  },
  {
    timestamps: true,
  }
);
const Query = mongoose.model("Query", queryschema);
module.exports = Query;
