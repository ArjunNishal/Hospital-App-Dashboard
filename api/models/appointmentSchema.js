const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    date: {
      type: Date,
    },
    concern: {
      type: String,
    },
    time: {
      type: Date,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
      //   0 == pending
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
