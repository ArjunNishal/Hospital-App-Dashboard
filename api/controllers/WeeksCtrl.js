const WeekMaster = require("../models/WeekMasterSchema");
const Week = require("../models/WeeksSchema");
const { pagination } = require("./pagination");
const fs = require("fs").promises;

exports.createWeek = async (req, res) => {
  try {
    const {
      week,
      admin,
      createdby,
      babytitle,
      babylength,
      babyweight,
      babysize,
      babydescription,
      momdescription,
      tipsymptoms,
      tiplifestyle,
      tipsex,
      babyuploadedImages,
      momuploadedImages,
      symptomsuploadedImages,
      lifestyleuploadedImages,
      sexuploadedImages,
      relatedblogs,
    } = req.body;

    // Handle images separately
    const babyImage = req.files?.babyImage
      ? req.files.babyImage[0].filename
      : "";
    const momImage = req.files?.momImage ? req.files.momImage[0].filename : "";

    const existingweek = await Week.findOne({
      admin: admin,
      status: 1,
      week: week,
    });

    if (existingweek) {
      return res.status(500).send({
        status: true,
        message: "A Week already exists for this week number.",
      });
    }

    const newWeek = new Week({
      week,
      admin,
      createdby,
      relatedblogs: JSON.parse(relatedblogs),
      baby: {
        image: babyImage,
        title: babytitle,
        length: babylength,
        weight: babyweight,
        size: babysize,
        description: babydescription,
        babyuploadedimages: JSON.parse(babyuploadedImages),
      },
      mom: {
        image: momImage,
        description: momdescription,
        MomuploadedImages: JSON.parse(momuploadedImages),
      },
      tip: {
        symptoms: tipsymptoms,
        lifestyle: tiplifestyle,
        sex: tipsex,
        symptomsUploadedImages: JSON.parse(symptomsuploadedImages),
        lifecycleuploadedImages: JSON.parse(lifestyleuploadedImages),
        sexUploadedImages: JSON.parse(sexuploadedImages),
      },
    });

    await newWeek.save();
    res
      .status(201)
      .json({ status: true, message: "Created Week successfully.", newWeek });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get week by admin ID
exports.getWeeksByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    let query = { admin: adminId };
    // let query = {};
    let populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "createdby", model: "Admin" },
      { path: "week", model: "WeekMaster" },
    ];

    const weeks = await pagination(
      Week,
      Week.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );

    // const weeks = await Week.find({ admin: adminId });
    res.status(200).json({
      status: true,
      message: " Weeks Fetched successfully.",
      data: weeks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get single week data by ID
exports.getWeekById = async (req, res) => {
  try {
    const { id } = req.params;
    const week = await Week.findById(id)
      .populate("admin createdby week")
      .populate({
        path: "relatedblogs",
        populate: {
          path: "admin createdby",
        },
      });
    if (!week) {
      return res.status(404).json({ message: "Week not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Week Fetched successfully.", week });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all weeks data
exports.getAllWeeks = async (req, res) => {
  try {
    // const weeks = await Week.find();

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    let query = null;
    // let query = {};
    let populateOptions = [
      { path: "admin", model: "Admin" },
      { path: "createdby", model: "Admin" },
      { path: "week", model: "WeekMaster" },
    ];

    const weeks = await pagination(
      Week,
      Week.find(query).populate(populateOptions).sort({ createdAt: -1 }),
      limitQuery
    );
    res.status(200).json({
      status: true,
      message: " Weeks Fetched successfully.",
      data: weeks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.validateweeknumber = async (req, res) => {
  try {
    const { number, adminId } = req.params;
    let weekId = null;

    if (req.query.wid) {
      weekId = req.query.wid;
    }

    // const weekNumber = parseInt(number, 10);

    let week = null;

    if (weekId !== null) {
      week = await Week.findOne({
        admin: adminId,
        week: number,
        _id: { $ne: weekId },
      });
    } else {
      week = await Week.findOne({
        admin: adminId,
        week: number,
      });
    }

    if (week) {
      // If the week number is not available, find available week numbers between 1 and 50
      const weeks = await Week.find({ admin: adminId }, "week").populate(
        "week"
      );
      // existing week data with week masters names
      const existingWeeks = weeks.map((w) => w.week.name);

      // all week masters
      const allweekmasters = await WeekMaster.find();

      const availableWeeks = allweekmasters.filter(
        (el) => !existingWeeks.includes(el.name)
      );

      // const availableWeeks = Array.from({ length: 50 }, (_, i) => i + 1).filter(
      //   (i) => !existingWeeks.includes(i)
      // );

      return res.status(200).send({
        status: false,
        message: "Week number not available",
        availableWeeks: availableWeeks.map((el) => el.name),
      });
    }

    res.status(200).json({ status: true, message: "Week number available." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateWeekStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (![0, 1, 2].includes(status)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid status value" });
    }

    const week = await Week.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!week) {
      return res.status(404).json({ status: false, message: "Week not found" });
    }

    res.status(200).json({
      status: true,
      message: " Week Status updated successfully.",
      week,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateWeek = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      week,
      babytitle,
      babylength,
      babyweight,
      babysize,
      babydescription,
      momdescription,
      tipsymptoms,
      tiplifestyle,
      tipsex,
      babyuploadedImages,
      momuploadedImages,
      symptomsuploadedImages,
      lifestyleuploadedImages,
      sexuploadedImages,
      relatedblogs,
    } = req.body;

    let updateData = {
      week,
      babytitle,
      babylength,
      babyweight,
      babysize,
      babydescription,
      momdescription,
      tipsymptoms,
      tiplifestyle,
      tipsex,
      babyuploadedImages,
      momuploadedImages,
      symptomsuploadedImages,
      lifestyleuploadedImages,
      sexuploadedImages,
    };

    console.log(updateData, "updateData");

    const existing = await Week.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ status: false, message: "Week not exists with this id." });
    }

    const extractImageUrls = (description) => {
      const regex = /src="([^"]*)"/g;
      const urls = [];
      let match;
      while ((match = regex.exec(description)) !== null) {
        urls.push(match[1]);
      }
      return urls;
    };

    const updateImageUrls = (field, description) => {
      console.log(field, description, "field, description");
      updateData[`${field}uploadedImages`] = extractImageUrls(description);
      // lifecycle uploadedImages
    };

    updateImageUrls("baby", babydescription);
    updateImageUrls("mom", momdescription);
    updateImageUrls("symptoms", tipsymptoms);
    updateImageUrls("lifestyle", tiplifestyle);
    updateImageUrls("sex", tipsex);

    const handleImageUpdate = async (field, fileKey, imagePath) => {
      if (req.files) {
        if (req.files?.[fileKey]) {
          if (existing[field]?.image) {
            try {
              await fs.unlink(`uploads/weeks/${existing[field].image}`);
            } catch (error) {
              console.error("Error deleting old image:", error);
            }
          }
          console.log(req.files[fileKey], "req.files");
          updateData[`${fileKey}`] = req.files[fileKey][0].filename;
        }
      }
    };

    await handleImageUpdate("baby", "babyImage", existing.baby?.image);
    await handleImageUpdate("mom", "momImage", existing.mom?.image);

    // console.log(field, description, "field, description");

    const weektoupdate = await Week.findById(id);

    weektoupdate.updatedby = req.realid;

    weektoupdate.week = week;
    weektoupdate.baby = {
      image: req.files?.babyImage ? updateData.babyImage : existing.baby.image,
      title: babytitle,
      length: babylength,
      weight: babyweight,
      size: babysize,
      description: babydescription,
      babyuploadedimages: updateData.babyuploadedImages,
    };
    weektoupdate.mom = {
      image: req.files?.momImage ? updateData.momImage : existing.mom.image,
      description: momdescription,
      MomuploadedImages: updateData.momuploadedImages,
    };

    (weektoupdate.relatedblogs = JSON.parse(relatedblogs)),
      console.log(
        updateData.lifestyleuploadedImages,
        "updateData.lifestyleuploadedImages"
      );
    weektoupdate.tip = {
      symptoms: tipsymptoms,
      symptomsUploadedImages: updateData.symptomsuploadedImages,
      lifestyle: tiplifestyle,
      lifecycleuploadedImages: updateData.lifestyleuploadedImages,
      sex: tipsex,
      sexUploadedImages: updateData.sexuploadedImages,
    };

    const updatedWeek = await weektoupdate.save();

    console.log("weektoupdate", weektoupdate, "weektoupdate");
    if (!weektoupdate) {
      return res.status(404).json({ status: false, message: "Week not found" });
    }

    const deleteOldImages = async (existingImages, newImages) => {
      for (const oldImageUrl of existingImages) {
        if (!newImages.includes(oldImageUrl)) {
          const imageName = oldImageUrl.split("weeks/")[1];
          const imagePath = `uploads/weeks/${imageName}`;
          try {
            await fs.unlink(imagePath);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
      }
    };

    await deleteOldImages(
      existing.baby.babyuploadedimages,
      updateData.babyuploadedImages
    );
    await deleteOldImages(
      existing.mom.MomuploadedImages,
      updateData.momuploadedImages
    );
    await deleteOldImages(
      existing.tip.symptomsUploadedImages,
      updateData.symptomsuploadedImages
    );
    await deleteOldImages(
      existing.tip.lifecycleuploadedImages,
      updateData.lifestyleuploadedImages
    );
    await deleteOldImages(
      existing.tip.sexUploadedImages,
      updateData.sexuploadedImages
    );

    res.status(200).json({
      status: true,
      message: "Week updated successfully.",
      updatedWeek,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    // Access the uploaded file details
    const files = req.files;

    // if (!files || files.length === 0) {
    //   return res.status(400).json({ message: "No file uploaded" });
    // }

    // Construct the URL for accessing the uploaded image
    // const imageUrl = `${req.protocol}://${req.get("host")}/${file.path}`;
    const fileUrls = files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/weeks/${
        file.filename
      }`;
    });

    // Respond with the URL of the uploaded image
    res.json({ urls: fileUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// master weeks
// Category Controllers
exports.createmasterweek = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await WeekMaster.findOne({ name });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Week Master already exists with this name.",
      });
    }

    const newCategory = await WeekMaster.create({ name });
    res.status(201).json({
      status: true,
      message: "Week Master Created Successfully",
      newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "error occurred while creating Week Master",
      error,
    });
  }
};

exports.updatemasterweek = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await WeekMaster.findById(req.params.id);

    const existing = await WeekMaster.findOne({
      name,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(500).send({
        status: false,
        message: "Week Master already exists with this name.",
      });
    }

    const updatedCategory = await WeekMaster.findByIdAndUpdate(
      req.params.id,
      { name, updatedby: req.realid },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "Week Master Updated Successfully",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error occurred while updating Week Master",
      error,
    });
  }
};

exports.updatemasterweekStatus = async (req, res) => {
  try {
    await WeekMaster.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res
      .status(200)
      .json({ message: "Week Master status updated successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "error occurred while updating Week Master",
      error,
    });
  }
};

exports.getAllmasterweeks = async (req, res) => {
  try {
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };
    console.log("categories");

    let query = {};
    // let populateOptions = {};

    const categories = await pagination(
      WeekMaster,
      WeekMaster.find(query).sort({ createdAt: -1 }),
      limitQuery
    );
    console.log(categories, "categories");
    // const categories = await WeekMaster.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: "Week Masters fetched Successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "error occurred while fetching Week Masters",
      error,
    });
  }
};
