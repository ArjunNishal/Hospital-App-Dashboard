const mongoose = require("mongoose");
const patient_Schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    username: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    mobileno: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "patient",
    },
    status: {
      type: Number,
      default: 1,
    },
    permissions: {
      type: Array,
    },
    image: {
      type: String,
      default: "user-vector.png",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    middlename: {
      type: String,
    },
    dob: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    maritalstatus: {
      type: String,
    },
    religion: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    lga: {
      type: String,
    },
    occupation: {
      type: String,
    },
    language: {
      type: String,
    },
    tribe: {
      type: String,
    },
    gaurdianname: {
      type: String,
    },
    bloodgroup: {
      type: String,
    },
    remarks: {
      type: String,
    },
    allergies: {
      type: String,
    },
    tpaID: {
      type: String,
    },
    tpavalidity: {
      type: String,
    },
    nationalidentification: {
      type: String,
    },
    alternatenumber: {
      type: String,
    },
    photo: {
      type: String,
    },
    jwtToken: {
      type: String,
    },
    date1: {
      type: Date,
    },
    date2: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const Patient = mongoose.model("Patient", patient_Schema);
module.exports = Patient;
