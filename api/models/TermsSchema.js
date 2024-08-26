// models/Account.js

const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema(
  {
    terms: {
      type: String,
    },
  },
  { timestamps: true }
);

termsSchema.statics.getSingleton = async function () {
  // Get the existing document if it exists, or create a new one
  let terms = await this.findOne();
  if (!terms) {
    terms = new this();
  }
  return terms;
};

const Terms = mongoose.model("Terms", termsSchema);

module.exports = Terms;
