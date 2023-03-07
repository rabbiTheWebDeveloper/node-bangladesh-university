const Student = require("../Models/studentModel");
const deleteFile = require("../Common/deleteFile");
const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const autoCreateFolder = require("../Common/autoCreateFolder");

// MULTER DECLARATIONS
const UPLOAD_FOLDER = __dirname + "/../Uploads/StudentFiles/";
autoCreateFolder(UPLOAD_FOLDER);

const PHOTO_NAME = "student_photo";
const CV_NAME = "student_cv";
const uploadPhoto = multer({
  limits: {
    fieldSize: 100000, // 1 MB
  },

  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },

    filename: async (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      let filename = Date.now() + fileExt;

      if (req?.params?.id) {
        const student = await Student.findById(req?.params?.id).select({
          studentID: 1,
        });

        filename = student.studentID + fileExt;
      }
      if (req?.body?.studentID) {
        filename = req?.body?.studentID + fileExt;
      }

      cb(null, filename);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.fieldname === PHOTO_NAME) {
      if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("File format is not supported! (Only jpg, png, jpeg)"));
      }
    } else if (file.fieldname === CV_NAME) {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("File format is not supported! (Only pdf)"));
      }
    }
  },
});

// UPLOAD MIDDLEWARE FOR STUDENT PHOTO
const fileUpload = (req, res, next) => {
  const upload = uploadPhoto.fields([
    { name: PHOTO_NAME, maxCount: 1 },
    { name: CV_NAME, maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      res.status(401).json({
        success: false,
        message: err.message,
        errMsg: err.message,
      });
    } else {
      // Everything went fine.
      next();
    }
  });
};

// CREATE STUDENT ROUTE
router.post("/create", fileUpload, async (req, res) => {
  try {
    let files = {
      photo: "",
      cv: "",
    };

    if (req?.files?.student_photo) {
      files = { ...files, photo: req?.files?.student_photo[0].path };
    }
    if (req?.files?.student_cv) {
      files = { ...files, cv: req?.files?.student_cv[0].path };
    }

    const createdData = await new Student({
      ...req.body,
      ...files,
      role: "STUDENT",
    });
    await createdData.save();

    res.status(200).json({
      success: true,
      message: "Student created successfully!",
      createdData,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Fail to create new Student!!",
      errMsg: err.message,
    });

    // DELETE UPLOADED FILE IF DATA NOT CREATE
    // deleteFile(req?.files.student_photo[0].path);
    // deleteFile(req?.files.student_cv[0].path);
  }
});

// FIND ALL STUDENT ROUTE
router.get("/all", async (req, res) => {
  try {
    const allData = await Student.find({}).sort({ createdAt: -1 });

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

// FIND ONE STUDENT ROUTE
router.get("/find/:id", async (req, res) => {
  try {
    const findOne = await Student.findById(req.params["id"]);

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

// DELETE STUDENT ROUTE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedData = await Student.findByIdAndDelete(req.params["id"]);

    res.status(200).json({
      success: true,
      message: "Success to DELETE the student!!",
      deletedData: deletedData,
    });

    // DELETE FILES FROM STORAGE
    deleteFile(deletedData?.photo);
    deleteFile(deletedData?.cv);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to DELETE the student!!",
      errMsg: err.message,
    });
  }
});

// UPDATE STUDENT ROUTE
router.put("/update/:id", fileUpload, async (req, res) => {
  try {
    let files = {
      photo: "",
      cv: "",
    };

    if (req?.files?.student_photo) {
      files = { ...files, photo: req?.files?.student_photo[0].path };
    }
    if (req?.files?.student_cv) {
      files = { ...files, cv: req?.files?.student_cv[0].path };
    }

    const updatedData = await Student.findByIdAndUpdate(req.params["id"], {
      ...req.body,
      ...files,
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

// Export All routes
module.exports = router;
