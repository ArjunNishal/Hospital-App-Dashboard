const mongoose = require("mongoose");

const WeightTrackerSchema = new mongoose.Schema(
  {
    weight: { type: String },
    name: { type: String },
    age: { type: String },
    date: { type: Date },
    weightunit: { type: String },
  },
  {
    timestamps: true,
  }
);

const KickCountsSchema = new mongoose.Schema(
  {
    start: { type: String },
    duration: { type: String },
    kicks: { type: String },
    startdate: { type: String },
    enddate: { type: String },
  },
  {
    timestamps: true,
  }
);

const EERDataSchema = new mongoose.Schema(
  {
    age: { type: String },
    height: { type: String },
    weight: { type: String },
    gender: { type: String },
    activityLevel: { type: String },
    totalEERScore: { type: String },
    heightunit: { type: String },
    weightunit: { type: String },
    name: String,
  },
  {
    timestamps: true,
  }
);

const BMRDataSchema = new mongoose.Schema(
  {
    age: { type: String },
    height: { type: String },
    weight: { type: String },
    gender: { type: String },
    bmrScore: { type: String },
    heightunit: { type: String },
    weightunit: { type: String },
    name: String,
  },
  {
    timestamps: true,
  }
);

const BMIDataSchema = new mongoose.Schema(
  {
    age: { type: String },
    height: { type: String },
    weight: { type: String },
    gender: { type: String },
    bmiScore: { type: String },
    heightunit: { type: String },
    weightunit: { type: String },
    name: String,
  },
  {
    timestamps: true,
  }
);

const TDEEDataSchema = new mongoose.Schema(
  {
    age: { type: String },
    height: { type: String },
    weight: { type: String },
    heightunit: { type: String },
    weightunit: { type: String },
    name: String,
    gender: { type: String },
    activityLevel: { type: String },
    tdeeScore: { type: String },
  },
  {
    timestamps: true,
  }
);

const WaterTrackerSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    ounces: { type: String },
    glass: { type: String },
    weight: { type: String },
    name: String,
    weightunit: { type: String },
  },
  {
    timestamps: true,
  }
);

const PersonalDataSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    weightTracker: [WeightTrackerSchema],
    kickCounts: [KickCountsSchema],
    eerData: [EERDataSchema],
    bmrData: [BMRDataSchema],
    bmiData: [BMIDataSchema],
    tdeeData: [TDEEDataSchema],
    waterTracker: [WaterTrackerSchema],
  },
  {
    timestamps: true,
  }
);

const PersonalData = mongoose.model("PersonalData", PersonalDataSchema);
module.exports = PersonalData;
