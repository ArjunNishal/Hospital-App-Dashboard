// models/Account.js

const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    aboutus: {
      type: String,
    },
  },
  { timestamps: true }
);

aboutUsSchema.statics.getSingleton = async function () {
  // Get the existing document if it exists, or create a new one
  let aboutus = await this.findOne();
  if (!aboutus) {
    aboutus = new this();
  }
  return aboutus;
};

const Aboutus = mongoose.model("Aboutus", aboutUsSchema);

module.exports = Aboutus;
