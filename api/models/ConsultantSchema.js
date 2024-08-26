const mongoose = require("mongoose");
const consultant_Schema = new mongoose.Schema(
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
      default: "consultant",
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
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    profiledetails: {
      title: {
        type: String,
      },
      licenseno: {
        type: String,
      },
      middlename: {
        type: String,
      },
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
      },
      mobileno: {
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
      placeofbirth: {
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
      specialization: {
        type: String,
      },
      language: {
        type: String,
      },
      tribe: {
        type: String,
      },
      staffid: {
        type: String,
      },
      role: {
        type: String,
      },
      designation: {
        type: String,
      },
      department: {
        type: String,
      },
      specialist: {
        type: String,
      },
      fathername: {
        type: String,
      },
      mothername: {
        type: String,
      },
      bloodgroup: {
        type: String,
      },
      dateofjoining: {
        type: String,
      },
      emergencycontact: {
        type: String,
      },
      permanentaddress: {
        type: String,
      },
      qualification: {
        type: String,
      },
      workexperience: {
        type: String,
      },
      note: {
        type: String,
      },
      nationalidentification: {
        type: String,
      },
      pan: {
        type: String,
      },
      localidentification: {
        type: String,
      },
      referencecontact: {
        type: String,
      },
      photo: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);
const Consultant = mongoose.model("Consultant", consultant_Schema);
module.exports = Consultant;
