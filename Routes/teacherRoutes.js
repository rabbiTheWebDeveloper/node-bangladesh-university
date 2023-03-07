const Teacher = require("../Models/teacherModel");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const replacePhoto = require("../Common/replacePhoto");
const deleteFile = require("../Common/deleteFile");
const express = require("express");
const router = express.Router();
const autoCreateFolder = require("../Common/autoCreateFolder");

// MULTER DECLARATIONS
const UPLOAD_FOLDER = __dirname + "/../Uploads/TeacherPhotos/";
autoCreateFolder(UPLOAD_FOLDER);

const INPUT_NAME = "teacher_photo";
const uploadPhoto = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLocaleLowerCase()
          .replace(" ", "_") +
        "-" +
        Date.now() +
        fileExt;

      cb(null, filename);
    },
  }),

  limits: {
    fieldSize: 1024 * 1024, // 1 MB
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File format is not supported!!!"));
    }
  },
});

// UPLOAD MIDDLEWARE FOR TEACHER PHOTO
const fileUpload = (req, res, next) => {
  const upload = uploadPhoto.single(INPUT_NAME);

  upload(req, res, function (err) {
    if (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    } else {
      // Everything went fine.
      next();
    }
  });
};

// CREATE TEACHER ROUTE
router.post("/create", fileUpload, async (req, res) => {
  try {
    const createdData = await new Teacher({
      ...req.body,
      photo: req?.file?.path,
      role: "TEACHER",
    });
    await createdData.save();

    res.status(200).json({
      success: true,
      message: "Teacher created successfully!",
      createdData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Fail to create new Teacher!!",
      errMsg: err.message,
    });
  }
});

// FIND ALL TEACHER ROUTE
router.get("/all", async (req, res) => {
  try {
    const allData = await Teacher.find({}).sort({ createdAt: -1 });

    res.status(200).json(allData);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to find data!!",
      errMsg: err.message,
    });
  }
});

// FIND ONE TEACHER ROUTE
router.get("/find/:id", async (req, res) => {
  try {
    const findOne = await Teacher.findById(req.params["id"]);

    res.status(200).json(findOne);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to find data!!",
      errMsg: err.message,
    });
  }
});

// DELETE TEACHER ROUTE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedData = await Teacher.findByIdAndDelete(req.params["id"]);

    res.status(200).json({
      success: true,
      message: "Success to DELETE the teacher!!",
      deletedData,
    });

    // DELETE PHOTO FROM STORAGE
    deleteFile(deletedData?.photo);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to DELETE the teacher!!",
      errMsg: err.message,
    });
  }
});

// UPDATE TEACHER ROUTE
router.put("/update/:id", fileUpload, async (req, res) => {
  try {
    // Replace image if it have already
    replacePhoto(Teacher, req);

    const updatedData = await Teacher.findByIdAndUpdate(req.params["id"], {
      ...req.body,
      photo: req?.file?.path,
    });

    res.status(200).json({
      success: true,
      message: "Success to UPDATE data!!",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to UPDATE data!!",
      errMsg: err.message,
    });
  }
});

// DELETE ALL TEACHERS ROUTE - Not for use
// router.delete("/delete-all", async (req, res) => {
//   try {
//     const deletedData = await Teacher.deleteMany({});

//     res.status(200).json({
//       success: true,
//       message: "Success to DELETE all teacher!!",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       success: false,
//       message: "Fail to DELETE all teacher!!",
//     });
//   }
// });

// Export All routes
module.exports = router;
