const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
// const FPO = require("../models/Fposchema");
const constants = require("../constants");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const { pagination } = require("./pagination");
const Consultant = require("../models/ConsultantSchema");
const Doctor = require("../models/DoctorSchema");
const Patient = require("../models/PatientSchema");
const { default: mongoose } = require("mongoose");
const PersonalData = require("../models/PersoneldetailsSchema");
const fs = require("fs").promises;

// search
const search = async (req, res) => {
  const { query, model, populateOptions } = req.body;
  console.log(req.body, "query");

  try {
    let result;

    if (model === "Blog") {
      result = await mongoose
        .model(model)
        .find(query)
        .populate("category admin createdby updatedby");
    } else if (model === "Week" && query.weekName) {
      result = await mongoose
        .model(model)
        .aggregate([
          {
            $lookup: {
              from: "weekmasters", // collection name in MongoDB (lowercase, plural form)
              localField: "week",
              foreignField: "_id",
              as: "weekMasterDetails",
            },
          },
          { $unwind: "$weekMasterDetails" },
          {
            $match: {
              "weekMasterDetails.name": {
                $regex: query.weekName,
                $options: "i",
              },
              ...(query.admin && {
                admin: new mongoose.Types.ObjectId(query.admin),
              }),
            },
          },
          {
            $project: {
              "weekMasterDetails._id": 0,
              "weekMasterDetails.__v": 0,
              "weekMasterDetails.createdAt": 0,
              "weekMasterDetails.updatedAt": 0,
            },
          },
        ])
        .exec();

      if (populateOptions && populateOptions.length > 0) {
        result = await mongoose.model(model).populate(result, populateOptions);
      }
    } else {
      result = await mongoose
        .model(model)
        .find(query)
        .populate(populateOptions);
    }

    console.log(result, result.length, "result***********************");
    console.log(query);
    res.json({ message: "success", success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// admin
const addAdmin = async (req, res) => {
  try {
    const {
      firstName,
      username,
      lastName,
      email,
      mobileno,
      password,
      role,
      permissions,
    } = req.body;
    console.log(permissions, req.body, "permissions//");
    // if (
    //   !firstName ||
    //   !username ||
    //   !lastName ||
    //   !email ||
    //   !mobileno ||
    //   !password ||
    //   !role ||
    //   !permissions
    // ) {
    //   return res.status(500).send({ status: false, message: "enter all details" });
    // }

    const existingAdminwmob = await Admin.findOne({
      mobileno,
      $or: [{ role: "admin" }, { role: "superadmin" }],
    });

    if (existingAdminwmob) {
      return res.status(500).json({
        Error: "Admin with the same mobile number already exists",
      });
    }
    const existingAdminwemail = await Admin.findOne({
      email,
      $or: [{ role: "admin" }, { role: "superadmin" }],
    });

    if (existingAdminwemail) {
      return res.status(500).json({
        Error: "Admin with the same email id already exists",
      });
    }
    const existingAdminwUsername = await Admin.findOne({
      username,
      $or: [{ role: "admin" }, { role: "superadmin" }],
    });

    if (existingAdminwUsername) {
      return res.status(500).json({
        Error: "This username is not available.",
      });
    }
    // console.log(permissions, typeof permissions, "permissions");

    // const passwordHash = await bcrypt.hash(password, 12);

    const data = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      password: password,
      role,
      permissions: permissions,
    };
    const admin = new Admin(data);

    const savedadmin = await admin.save();

    res.json({ Success: "New admin added Successfully", admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while adding the admin" });
  }
};

const editAdminDetails = async (req, res) => {
  const { adminId } = req.params;
  const {
    username,
    email,
    permissions,
    password,
    firstName,
    lastName,
    mobileno,
  } = req.body;

  try {
    // Find the admin by their ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Compare old and new permissions
    const oldPermissions = admin.permissions;
    const newPermissions = permissions;

    const addedPermissions = newPermissions.filter(
      (p) => !oldPermissions.includes(p)
    );
    const removedPermissions = oldPermissions.filter(
      (p) => !newPermissions.includes(p)
    );

    // Update the admin's details
    admin.username = username;
    admin.email = email;
    admin.permissions = newPermissions;
    admin.password = password;
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.mobileno = mobileno;

    // Save the updated admin
    const updatedAdmin = await admin.save();

    // Find all consultants and doctors with the same admin ID
    const consultantsAndDoctors = await Promise.all([
      Consultant.find({ admin: admin._id }),
      Doctor.find({ admin: admin._id }),
    ]);

    // Flatten the results into a single array
    const usersToUpdate = [].concat(...consultantsAndDoctors);

    // Update permissions for each user
    for (let user of usersToUpdate) {
      user.permissions = user.permissions.filter(
        (p) => !removedPermissions.includes(p)
      );

      const usertoupdate = await Admin.findById(user.memberId);

      usertoupdate.permissions = user.permissions.filter(
        (p) => !removedPermissions.includes(p)
      );
      // const permToAdd = addedPermissions.filter((el) =>
      //   permissionslistconsultant.includes(el)
      // );

      // user.permissions = [...new Set([...user.permissions, ...permToAdd])];
      await usertoupdate.save();
      await user.save();
    }

    res.status(200).json({
      admin: updatedAdmin,
      message: "Admin details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while updating admin details" });
  }
};

const getalladmins = async (req, res) => {
  try {
    const { role } = req.query;

    // Construct the query to filter by role
    const query = role ? { role } : {};

    // Define a variable to store the population options
    let populateOptions = null;

    // If the role is "fpoadmin," set the population options
    // if (role === "ad") {
    //   populateOptions = { path: "fpo", model: "FPO" };
    // }

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const admins = await pagination(
      Admin,
      Admin.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );
    // const admins = await Admin.find(query)
    //   .populate(populateOptions)
    //   .sort({ createdAt: -1 });

    res.status(200).send({ admins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while fetching the admins" });
  }
};

const blockOrUnblockAdmin = async (req, res) => {
  const { adminId, status } = req.body;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Block or unblock the admin
    admin.status = status;
    await admin.save();

    res.status(200).json({
      message:
        status === 2
          ? "Admin blocked successfully"
          : status === 1
          ? "Admin Activated successfully"
          : "Admin Deactivated successfully",
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error while updating the admin",
    });
  }
};

// consultant

const addConsultant = async (req, res) => {
  try {
    const {
      firstName,
      username,
      lastName,
      email,
      mobileno,
      password,
      role,

      permissions,
      createdby,
    } = req.body;
    // console.log(permissions, req.body, "permissions//");
    const existingAdminwmob = await Consultant.findOne({
      mobileno,
    });

    if (existingAdminwmob) {
      return res.status(500).json({
        Error: "Consultant with the same mobile number already exists",
      });
    }
    const existingAdminwemail = await Consultant.findOne({
      email,
    });

    if (existingAdminwemail) {
      return res.status(500).json({
        Error: "Consultant with the same email id already exists",
      });
    }
    const existingAdminwUsername = await Consultant.findOne({
      username,
    });

    if (existingAdminwUsername) {
      return res.status(500).json({
        Error: "This username is not available.",
      });
    }
    // console.log(permissions, typeof permissions, "permissions");

    // const passwordHash = await bcrypt.hash(password, 12);

    let adminid;
    if (req.detail.role === "admin" || req.detail.role === "superadmin") {
      adminid = req.user;
    } else {
      if (req.detail.role === "doctor") {
        const useradmin = await Doctor.findById(req.user);
        // console.log(useradmin, req.user, req.detail.role, "useradmin");
        adminid = useradmin.admin;
      }
    }

    const data2 = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      password: password,
      role,
      permissions: permissions,
    };
    const consultant = new Admin(data2);

    const savedconsultant = await consultant.save();

    console.log(createdby, "//createdby//");

    const data = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      admin: adminid,
      createdby: createdby,
      password: password,
      role,
      permissions: permissions,
      memberId: savedconsultant._id,
    };
    const admin = new Consultant(data);
    const savedadmin = await admin.save();

    res.json({ Success: "New Consultant added Successfully", admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while adding the Consultant" });
  }
};

const editConsultantDetails = async (req, res) => {
  const { consultantId } = req.params;
  const {
    username,
    email,
    permissions,
    password,
    firstName,
    lastName,
    mobileno,
  } = req.body;

  try {
    // Find the admin by their ID
    const consultant = await Consultant.findById(consultantId);

    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    const consultantmemberID = await Admin.findById(consultant.memberId);

    const oldPermissions = consultant.permissions;
    const newPermissions = permissions;

    const removedPermissions = oldPermissions.filter(
      (p) => !newPermissions.includes(p)
    );

    // Update the consultant's details
    consultant.username = username;
    consultant.email = email;
    consultant.permissions = permissions;
    consultant.password = password;
    consultant.firstName = firstName;
    consultant.lastName = lastName;
    consultant.mobileno = mobileno;

    // Save the updated consultant
    const updatedconsultant = await consultant.save();

    consultantmemberID.username = username;
    consultantmemberID.email = email;
    consultantmemberID.permissions = permissions;
    consultantmemberID.password = password;
    consultantmemberID.firstName = firstName;
    consultantmemberID.lastName = lastName;
    consultantmemberID.mobileno = mobileno;

    const updatedconsultantmemberID = await consultantmemberID.save();

    const doctorsToUpdate = await Doctor.find({
      createdby: consultant.memberId,
    });
    console.log(doctorsToUpdate, consultantId, "doctorsToUpdate");

    for (let user of doctorsToUpdate) {
      console.log(user, "user");
      user.permissions = user.permissions.filter(
        (p) => !removedPermissions.includes(p)
      );

      const usertoupdate = await Admin.findById(user.memberId);

      usertoupdate.permissions = user.permissions.filter(
        (p) => !removedPermissions.includes(p)
      );
      await usertoupdate.save();
      await user.save();
    }

    res.status(200).json({
      admin: updatedconsultant,
      message: "Consultant details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while updating Consultant details" });
  }
};

const getallConsultant = async (req, res) => {
  try {
    const { role, adminID, createdby } = req.query;

    // Construct the query to filter by role
    let query = role ? { role } : {};
    if (adminID) {
      query = {
        role,
        admin: adminID,
      };
    }

    if (createdby) {
      query = {
        role,
        createdby: createdby,
      };
    }

    // Define a variable to store the population options
    let populateOptions = null;

    // If the role is "fpoadmin," set the population options
    // if (role === "ad") {
    populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "createdby", model: "Admin" },
    ];
    // }

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const admins = await pagination(
      Consultant,
      Consultant.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );
    // const admins = await Consultant.find(query)
    //   .populate(populateOptions)
    //   .sort({ createdAt: -1 });

    res.status(200).send({ admins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while fetching the Consultants" });
  }
};

const blockOrUnblockConsultant = async (req, res) => {
  const { adminId, status } = req.body;

  try {
    const admin = await Consultant.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Consultant not found" });
    }
    const consultantmemberID = await Admin.findById(admin.memberId);

    if (!consultantmemberID) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    // Block or unblock the admin
    admin.status = status;
    await admin.save();

    consultantmemberID.status = status;

    const updatedconsultantmemberID = await consultantmemberID.save();

    res.status(200).json({
      message:
        status === 2
          ? "Consultant blocked successfully"
          : status === 1
          ? "Consultant Activated successfully"
          : "Consultant Deactivated successfully",
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error while updating the Consultant",
    });
  }
};

// doctor

const addDoctor = async (req, res) => {
  try {
    const {
      firstName,
      username,
      lastName,
      email,
      mobileno,
      password,
      role,
      // adminid,
      permissions,
      createdby,
    } = req.body;
    console.log(permissions, req.body, "permissions//");
    const existingAdminwmob = await Doctor.findOne({
      mobileno,
    });

    if (existingAdminwmob) {
      return res.status(500).json({
        Error: "Doctor with the same mobile number already exists",
      });
    }
    const existingAdminwemail = await Doctor.findOne({
      email,
    });

    if (existingAdminwemail) {
      return res.status(500).json({
        Error: "Doctor with the same email id already exists",
      });
    }
    const existingAdminwUsername = await Doctor.findOne({
      username,
    });

    if (existingAdminwUsername) {
      return res.status(500).json({
        Error: "This username is not available.",
      });
    }
    // console.log(permissions, typeof permissions, "permissions");

    // const passwordHash = await bcrypt.hash(password, 12);
    let adminid;
    if (req.detail.role === "admin" || req.detail.role === "superadmin") {
      adminid = req.user;
    } else {
      if (req.detail.role === "consultant") {
        const useradmin = await Consultant.findById(req.user);
        console.log(useradmin.admin, req.user, req.detail.role, "useradmin");
        adminid = useradmin.admin;
      }
    }

    const data2 = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      password: password,
      role,
      permissions: permissions,
    };
    const doctor = new Admin(data2);
    const saveddoctor = await doctor.save();

    const data = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      admin: adminid,
      createdby: createdby,
      password: password,
      role,
      permissions: permissions,
      memberId: saveddoctor._id,
    };
    const admin = new Doctor(data);
    const savedadmin = await admin.save();

    res.json({ Success: "New Doctor added Successfully", admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while adding the Doctor" });
  }
};

const editDoctorDetails = async (req, res) => {
  const { doctorId } = req.params;
  const {
    username,
    email,
    permissions,
    password,
    firstName,
    lastName,
    mobileno,
  } = req.body;

  try {
    // Find the admin by their ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "doctor not found" });
    }

    const oldPermissions = doctor.permissions;
    const newPermissions = permissions;

    const removedPermissions = oldPermissions.filter(
      (p) => !newPermissions.includes(p)
    );

    // Update the doctor's details
    doctor.username = username;
    doctor.email = email;
    doctor.permissions = permissions;
    doctor.password = password;
    doctor.firstName = firstName;
    doctor.lastName = lastName;
    doctor.mobileno = mobileno;

    // Save the updated doctor
    const updateddoctor = await doctor.save();

    const doctormemberID = await Admin.findById(doctor.memberId);

    doctormemberID.username = username;
    doctormemberID.email = email;
    doctormemberID.permissions = permissions;
    doctormemberID.password = password;
    doctormemberID.firstName = firstName;
    doctormemberID.lastName = lastName;
    doctormemberID.mobileno = mobileno;

    const updateddoctormemberID = await doctormemberID.save();

    const consultantstoupdate = await Consultant.find({
      createdby: doctor.memberId,
    });

    console.log(
      consultantstoupdate,
      doctor.memberId,
      removedPermissions,
      "doctor.memberId"
    );

    for (let user of consultantstoupdate) {
      console.log(
        user,
        user.permissions.filter((p) => !removedPermissions.includes(p))
      );
      user.permissions = user.permissions.filter(
        (p) => !removedPermissions.includes(p)
      );

      const usertoupdate = await Admin.findById(user.memberId);

      usertoupdate.permissions = user.permissions.filter(
        (p) => !removedPermissions.includes(p)
      );
      await usertoupdate.save();
      await user.save();
    }

    res.status(200).json({
      admin: updateddoctor,
      message: "doctor details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while updating doctor details" });
  }
};

const getallDoctor = async (req, res) => {
  try {
    const { role, adminID, createdby } = req.query;

    // Construct the query to filter by role
    let query = role ? { role } : {};
    if (adminID) {
      query = {
        role,
        admin: adminID,
      };
    }

    if (createdby) {
      query = {
        role,
        createdby: createdby,
      };
    }

    // Define a variable to store the population options
    let populateOptions = null;

    // If the role is "fpoadmin," set the population options
    // if (role === "ad") {
    populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "createdby", model: "Admin" },
    ];
    // }

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const admins = await pagination(
      Doctor,
      Doctor.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );
    // const admins = await Doctor.find(query)
    //   .populate(populateOptions)
    //   .sort({ createdAt: -1 });

    res.status(200).send({ admins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while fetching the Doctors" });
  }
};

const blockOrUnblockDoctor = async (req, res) => {
  const { adminId, status } = req.body;

  try {
    const admin = await Doctor.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Block or unblock the admin

    const doctormemberID = await Admin.findById(admin.memberId);

    if (!doctormemberID) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    admin.status = status;
    await admin.save();

    doctormemberID.status = status;

    const updateddoctormemberID = await doctormemberID.save();

    res.status(200).json({
      message:
        status === 2
          ? "Doctor blocked successfully"
          : status === 1
          ? "Doctor Activated successfully"
          : "Doctor Deactivated successfully",
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error while updating the Doctor",
    });
  }
};

// patient

const addPatient = async (req, res) => {
  try {
    const {
      username,
      email,
      mobileno,
      password,
      role,
      firstName,
      lastName,
      createdby,
      dob,
      middlename,
      age,
      gender,
      maritalstatus,
      religion,
      address,
      city,
      state,
      country,
      lga,
      occupation,
      language,
      tribe,
      gaurdianname,
      bloodgroup,
      remarks,
      allergies,
      tpaID,
      tpavalidity,
      nationalidentification,
      alternatenumber,
    } = req.body;

    console.log(req.body, typeof mobileno, "permissions");
    const existingAdminwmob = await Patient.findOne({
      mobileno,
    });

    if (existingAdminwmob) {
      return res.status(500).json({
        Error: "Patient with the same mobile number already exists",
      });
    }
    const existingAdminwemail = await Patient.findOne({
      email,
    });

    if (existingAdminwemail) {
      return res.status(500).json({
        Error: "Patient with the same email id already exists",
      });
    }
    const existingAdminwUsername = await Patient.findOne({
      username,
    });

    if (existingAdminwUsername) {
      return res.status(500).json({
        Error: "This username is not available.",
      });
    }

    // const passwordHash = await bcrypt.hash(password, 12);

    let adminid;
    if (req.detail.role === "admin" || req.detail.role === "superadmin") {
      adminid = req.user;
    } else {
      if (req.detail.role === "doctor") {
        const useradmin = await Doctor.findById(req.user);
        console.log(useradmin, req.user, req.detail.role, "useradmin");
        adminid = useradmin.admin;
      }
      if (req.detail.role === "consultant") {
        const useradmin = await Consultant.findById(req.user);
        console.log(useradmin, req.user, req.detail.role, "useradmin");
        adminid = useradmin.admin;
      }
    }

    const data = {
      firstName,
      lastName,
      username,
      email,
      mobileno,
      admin: adminid,
      createdby: createdby,
      password: password,
      dob,
      middlename,
      age,
      gender,
      maritalstatus,
      religion,
      address,
      city,
      state,
      country,
      lga,
      occupation,
      language,
      tribe,
      gaurdianname,
      bloodgroup,
      remarks,
      allergies,
      tpaID,
      tpavalidity,
      nationalidentification,
      alternatenumber,
      // photo: req.file ? req.file.filename : "",
      // image: req.file ? req.file.filename : "",
      // permissions: permissions,
    };

    console.log(data, "data");
    const patient = new Patient(data);

    const savedpatient = await patient.save();

    const personalData = new PersonalData({ patient: savedpatient._id });
    await personalData.save();
    res.json({ Success: "New Patient added Successfully", patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while adding the Patient" });
  }
};

const editPatientDetails = async (req, res) => {
  const { patientId } = req.params;
  const {
    username,
    email,
    // permissions,
    password,
    firstName,
    lastName,
    mobileno,
    dob,
    middlename,
    age,
    gender,
    maritalstatus,
    religion,
    address,
    city,
    state,
    country,
    lga,
    occupation,
    language,
    tribe,
    gaurdianname,
    bloodgroup,
    remarks,
    allergies,
    tpaID,
    tpavalidity,
    nationalidentification,
    alternatenumber,
  } = req.body;

  try {
    // Find the admin by their ID
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ error: "patient not found" });
    }

    // Update the patient's details
    patient.username = username;
    patient.email = email;
    // patient.permissions = permissions;
    patient.password = password;
    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.mobileno = mobileno;
    patient.dob = dob;
    patient.middlename = middlename;
    patient.age = age;
    patient.gender = gender;
    patient.maritalstatus = maritalstatus;
    patient.religion = religion;
    patient.address = address;
    patient.city = city;
    patient.state = state;
    patient.country = country;
    patient.lga = lga;
    patient.occupation = occupation;
    patient.language = language;
    patient.tribe = tribe;
    patient.gaurdianname = gaurdianname;
    patient.bloodgroup = bloodgroup;
    patient.remarks = remarks;
    patient.allergies = allergies;
    patient.tpaID = tpaID;
    patient.tpavalidity = tpavalidity;
    patient.nationalidentification = nationalidentification;
    patient.alternatenumber = alternatenumber;

    // if (req.file) {
    //   console.log(req.file, "req.file");
    //   if (patient.photo) {
    //     oldImage = patient.photo;
    //     const imagePath = `uploads/profile/${oldImage}`;
    //     // Check if the old image file exists before attempting to delete it
    //     try {
    //       await fs.unlink(imagePath); // Delete old image from uploads folder
    //     } catch (error) {
    //       console.error("Error deleting old image:", error);
    //     }
    //   }
    // }

    // patient.photo = req.file ? req.file.filename : patient.photo;
    // patient.image = req.file ? req.file.filename : patient.image;

    // Save the updated patient
    const updatedpatient = await patient.save();

    res.status(200).json({
      admin: updatedpatient,
      message: "Patient details updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while updating Patient details" });
  }
};

const getallPatient = async (req, res) => {
  try {
    const { role, adminID, createdby } = req.query;

    // Construct the query to filter by role
    let query = role ? { role } : {};
    let populateOptions = null;

    populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "createdby", model: "Admin" },
    ];

    if (adminID) {
      query = {
        role,
        admin: adminID,
      };
    }

    if (createdby) {
      query = {
        role,
        createdby: createdby,
      };
    }

    // Define a variable to store the population options

    // If the role is "fpoadmin," set the population options
    // if (role === "ad") {

    // }

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const admins = await pagination(
      Patient,
      Patient.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );
    // const admins = await Doctor.find(query)
    //   .populate(populateOptions)
    //   .sort({ createdAt: -1 });

    res.status(200).send({ admins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while fetching the Patients" });
  }
};

const getallPatientwopagination = async (req, res) => {
  try {
    const { role, adminID, createdby } = req.query;

    // Construct the query to filter by role
    let query = role ? { role } : {};
    let populateOptions = null;

    populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "createdby", model: "Admin" },
    ];

    if (adminID) {
      query = {
        role,
        admin: adminID,
      };
    }

    if (createdby) {
      query = {
        role,
        createdby: createdby,
      };
    }

    const admins = await Patient.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    res.status(200).send({ admins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while fetching the Patients" });
  }
};

const blockOrUnblockPatient = async (req, res) => {
  const { adminId, status } = req.body;

  try {
    const admin = await Patient.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Block or unblock the admin
    admin.status = status;
    await admin.save();

    res.status(200).json({
      message:
        status === 2
          ? "Patient blocked successfully"
          : status === 1
          ? "Patient Activated successfully"
          : "Patient Deactivated successfully",
      admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error while updating the Patient",
    });
  }
};

// profile

const updateRoleProfile = async (req, res) => {
  try {
    const {
      title,
      licenseno,
      middlename,
      firstname,
      lastname,
      email,
      mobileno,
      dob,
      age,
      gender,
      maritalstatus,
      placeofbirth,
      religion,
      address,
      city,
      state,
      country,
      lga,
      specialization,
      language,
      tribe,
      staffid,
      role,
      designation,
      department,
      specialist,
      fathername,
      mothername,
      bloodgroup,
      dateofjoining,
      emergencycontact,
      permanentaddress,
      qualification,
      workexperience,
      note,
      nationalidentification,
      pan,
      localidentification,
      referencecontact,
      // photo,
    } = req.body;

    console.log(req.body, "////////////////body");

    const role1 = req.detail.role;
    let existingUserwMob;

    if (role1 === "consultant") {
      existingUserwMob = await Consultant.findOne({
        mobileno,
        _id: { $ne: req.user },
      });
    } else if (role1 === "doctor") {
      existingUserwMob = await Doctor.findOne({
        mobileno,
        _id: { $ne: req.user },
      });
    } else if (role1 === "admin") {
      existingUserwMob = await Admin.findOne({
        mobileno,
        role: "admin",
        _id: { $ne: req.user },
      });
    }

    if (existingUserwMob) {
      console.log(existingUserwMob);
      return res.status(500).send({
        status: false,
        message: `${role1} with same mobile number exists.`,
      });
    }

    let existingUserwEmail;

    if (role1 === "consultant") {
      existingUserwEmail = await Consultant.findOne({
        email,
        _id: { $ne: req.user },
      });
    } else if (role1 === "doctor") {
      existingUserwEmail = await Doctor.findOne({
        email,
        _id: { $ne: req.user },
      });
    } else if (role1 === "admin") {
      existingUserwEmail = await Admin.findOne({
        email,
        role: "admin",
        _id: { $ne: req.user },
      });
    }

    if (existingUserwEmail) {
      return res.status(500).send({
        status: false,
        message: `${role1} with same email exists.`,
      });
    }

    let user;

    if (role1 === "consultant") {
      user = await Consultant.findById(req.user);
    } else if (role1 === "doctor") {
      user = await Doctor.findById(req.user);
    } else if (role1 === "admin") {
      user = await Admin.findById(req.user);
    }
    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found`,
      });
    }

    // update basic details of account of user
    user.firstName = firstname;
    user.lastName = lastname;
    user.email = email;
    user.mobileno = mobileno;

    // update profile details
    user.profiledetails.title = title;
    user.profiledetails.licenseno = licenseno;
    user.profiledetails.middlename = middlename;
    user.profiledetails.firstname = firstname;
    user.profiledetails.lastname = lastname;
    user.profiledetails.email = email;
    user.profiledetails.mobileno = mobileno;
    user.profiledetails.dob = dob;
    user.profiledetails.age = age;
    user.profiledetails.gender = gender;
    user.profiledetails.maritalstatus = maritalstatus;
    user.profiledetails.placeofbirth = placeofbirth;
    user.profiledetails.religion = religion;
    user.profiledetails.address = address;
    user.profiledetails.city = city;
    user.profiledetails.state = state;
    user.profiledetails.country = country;
    user.profiledetails.lga = lga;
    user.profiledetails.specialization = specialization;
    user.profiledetails.language = language;
    user.profiledetails.staffid = staffid;
    user.profiledetails.role = role;
    user.profiledetails.designation = designation;
    user.profiledetails.department = department;
    user.profiledetails.specialist = specialist;
    user.profiledetails.fathername = fathername;
    user.profiledetails.mothername = mothername;
    user.profiledetails.bloodgroup = bloodgroup;
    user.profiledetails.dateofjoining = dateofjoining;
    user.profiledetails.emergencycontact = emergencycontact;
    user.profiledetails.permanentaddress = permanentaddress;
    user.profiledetails.qualification = qualification;
    user.profiledetails.workexperience = workexperience;
    user.profiledetails.note = note;
    user.profiledetails.nationalidentification = nationalidentification;
    user.profiledetails.pan = pan;
    user.profiledetails.localidentification = localidentification;
    user.profiledetails.referencecontact = referencecontact;
    user.profiledetails.tribe = tribe;
    // let oldImage;
    // if (req.file) {
    //   if (user.profiledetails.photo) {
    //     oldImage = user.profiledetails.photo;
    //     const imagePath = `uploads/profileform/${oldImage}`;
    //     // Check if the old image file exists before attempting to delete it
    //     try {
    //       await fs.unlink(imagePath); // Delete old image from uploads folder
    //     } catch (error) {
    //       console.error("Error deleting old image:", error);
    //     }
    //   }
    //   user.profiledetails.photo = req.file.filename;
    // }

    const savedUser = await user.save();

    if (role1 === "consultant" || role1 === "doctor") {
      const adminuser = await Admin.findById(user.memberId);
      adminuser.firstName = firstname;
      adminuser.lastName = lastname;
      adminuser.email = email;
      adminuser.mobileno = mobileno;

      await adminuser.save();
    }

    //  user.profiledetails

    res.json({ Success: "Profile updated Successfully", savedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while adding the Doctor" });
  }
};

const updateProfiledetails = async (req, res) => {
  try {
    const { username, email, mobileno, firstName, lastName } = req.body;

    const role = req.detail.role;
    let existingUserwMob;

    if (role === "consultant") {
      existingUserwMob = await Consultant.findOne({
        mobileno,
        _id: { $ne: req.user },
      });
    } else if (role === "doctor") {
      existingUserwMob = await Doctor.findOne({
        mobileno,
        _id: { $ne: req.user },
      });
    } else if (role === "admin") {
      existingUserwMob = await Admin.findOne({
        mobileno,
        role: "admin",
        _id: { $ne: req.user },
      });
    } else if (role === "superadmin") {
      existingUserwMob = await Admin.findOne({
        mobileno,
        role: "superadmin",
        _id: { $ne: req.user },
      });
    }

    if (existingUserwMob) {
      return res.status(500).send({
        status: false,
        message: `${role} with same mobile number exists.`,
      });
    }

    let existingUserwEmail;

    if (role === "consultant") {
      existingUserwEmail = await Consultant.findOne({
        email,
        _id: { $ne: req.user },
      });
    } else if (role === "doctor") {
      existingUserwEmail = await Doctor.findOne({
        email,
        _id: { $ne: req.user },
      });
    } else if (role === "admin") {
      existingUserwMob = await Admin.findOne({
        email,
        role: "admin",
        _id: { $ne: req.user },
      });
    } else if (role === "superadmin") {
      existingUserwMob = await Admin.findOne({
        email,
        role: "superadmin",
        _id: { $ne: req.user },
      });
    }

    if (existingUserwEmail) {
      return res.status(500).send({
        status: false,
        message: `${role} with same email exists.`,
      });
    }
    let existingUserwUserName;

    if (role === "consultant") {
      existingUserwUserName = await Consultant.findOne({
        username,
        _id: { $ne: req.user },
      });
    } else if (role === "doctor") {
      existingUserwUserName = await Doctor.findOne({
        username,
        _id: { $ne: req.user },
      });
    } else if (role === "admin") {
      existingUserwMob = await Admin.findOne({
        username,
        role: "admin",
        _id: { $ne: req.user },
      });
    } else if (role === "superadmin") {
      existingUserwMob = await Admin.findOne({
        username,
        role: "superadmin",
        _id: { $ne: req.user },
      });
    }

    if (existingUserwUserName) {
      return res.status(500).send({
        status: false,
        message: `${role} with same username exists.`,
      });
    }

    let user;

    if (role === "consultant") {
      user = await Consultant.findById(req.user);
    } else if (role === "doctor") {
      user = await Doctor.findById(req.user);
    } else if (role === "admin") {
      user = await Admin.findById(req.user);
    } else if (role === "superadmin") {
      user = await Admin.findById(req.user);
    }
    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found`,
      });
    }

    // update basic details of account of user
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.mobileno = mobileno;
    user.username = username;

    if (role === "admin") {
      user.profiledetails.firstname = firstName;
      user.profiledetails.lastname = lastName;
      user.profiledetails.email = email;
      user.profiledetails.mobileno = mobileno;
    }

    if (role === "consultant" || role === "doctor") {
      const adminuser = await Admin.findById(user.memberId);
      adminuser.firstName = firstName;
      adminuser.lastName = lastName;
      adminuser.email = email;
      adminuser.mobileno = mobileno;
      adminuser.username = username;

      await adminuser.save();

      user.profiledetails.firstname = firstName;
      user.profiledetails.lastname = lastName;
      user.profiledetails.email = email;
      user.profiledetails.mobileno = mobileno;
    }

    const savedUser = await user.save();

    //  user.profiledetails

    res.json({
      status: true,
      message: "Profile updated Successfully",
      Success: "Profile updated Successfully",
      data: savedUser,
      savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "failed",
      Error: "Error while adding the Doctor",
      error,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const role = req.detail.role;

    let user;

    if (role === "consultant") {
      user = await Consultant.findById(req.user).populate("admin createdby");
    } else if (role === "doctor") {
      user = await Doctor.findById(req.user).populate("admin createdby");
    } else if (role === "admin" || role === "superadmin") {
      user = await Admin.findById(req.user);
    }

    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found`,
      });
    }
    res
      .status(200)
      .send({ status: true, message: "fetchedprofile", data: user, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "failed",
      Error: "Error while fetching the Doctors",
      error,
    });
  }
};

const getpermissions = async (req, res) => {
  try {
    // const role = req.detail.role;

    const { role, creatorid } = req.body;

    let user;
    console.log(creatorid);
    // if (role === "consultant") {
    //   user = await Admin.findById(req.detail.memberid);
    // } else if (role === "doctor") {
    //   user = await Admin.findById(req.detail.memberid);
    // } else if (role === "admin" || role === "superadmin") {
    //   user = await Admin.findById(req.user);
    // }

    // if (creatorid) {
    user = await Admin.findById(creatorid);
    // }

    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found`,
      });
    }
    res.status(200).send({ permissions: user.permissions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Error while fetching the Doctors" });
  }
};

const updateProfilepic = async (req, res) => {
  try {
    const role = req.detail.role;
    let user;

    if (role === "consultant") {
      user = await Consultant.findById(req.user);
    } else if (role === "doctor") {
      user = await Doctor.findById(req.user);
    } else if (role === "admin") {
      user = await Admin.findById(req.user);
    } else if (role === "superadmin") {
      user = await Admin.findById(req.user);
    }
    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User not found`,
      });
    }

    // let imagenew = null;

    let token = null;

    if (req.file) {
      // New image uploaded, so delete old image if it exists
      // const blog = await Blog.findById(blogId);
      if (user.image) {
        oldImage = user.image;
        const imagePath = `uploads/profile/${user.image}`;
        // Check if the old image file exists before attempting to delete it
        try {
          await fs.unlink(imagePath); // Delete old image from uploads folder
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      user.image = req.file.filename;
      if (role === "consultant" || role === "doctor") {
        const adminuser = await Admin.findById(user.memberId);
        adminuser.image = req.file.filename;
        await adminuser.save();
        token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            mobileno: user.mobileno,
            role: user.role,
            email: user.email,
            permissions: user.permissions,
            adminId: user.admin,
            memberid: user.memberId,
            image: user.image,

            // fpo: admin?.fpo,
            // image: admin?.image,
          },
          process.env.JWT_SECRET_KEY
        );
      } else {
        token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            mobileno: user.mobileno,
            role: user.role,
            email: user.email,
            permissions: user.permissions,
            image: user.image,
            // fpo: admin?.fpo,
            // image: admin?.image,
          },
          process.env.JWT_SECRET_KEY
        );
      }

      const savedUser = await user.save();
      // Update image with the new image filename
    } else {
      return res.status(500).json({
        status: false,
        message: "Please select a file to update profile picture",
      });
    }

    res
      .status(200)
      .json({ status: true, message: "pictureSuccessfully", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Error while adding the picture" });
  }
};

module.exports = {
  addAdmin,
  getalladmins,
  editAdminDetails,
  blockOrUnblockAdmin,
  addConsultant,
  editConsultantDetails,
  getallConsultant,
  blockOrUnblockConsultant,
  addDoctor,
  editDoctorDetails,
  getallDoctor,
  blockOrUnblockDoctor,
  updateRoleProfile,
  getProfile,
  addPatient,
  editPatientDetails,
  getallPatient,
  blockOrUnblockPatient,
  search,
  updateProfiledetails,
  getpermissions,
  updateProfilepic,
  getallPatientwopagination,
};
