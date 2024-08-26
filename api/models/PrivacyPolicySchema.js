// models/Account.js

const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
  {
    privacy: {
      type: String,
    },
  },
  { timestamps: true }
);

privacySchema.statics.getSingleton = async function () {
  // Get the existing document if it exists, or create a new one
  let privacy = await this.findOne();
  if (!privacy) {
    privacy = new this();
  }
  return privacy;
};

const Privacy = mongoose.model("Privacy", privacySchema);

module.exports = Privacy;
