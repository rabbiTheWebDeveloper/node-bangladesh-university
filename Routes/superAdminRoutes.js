const SuperAdmin = require("../Models/superAdminModel");
const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const autoCreateFolder = require("../Common/autoCreateFolder");
const replacePhoto = require("../Common/replacePhoto");

// MULTER DECLARATIONS
const UPLOAD_FOLDER = __dirname + "/../Uploads/AdminPhotos/";
autoCreateFolder(UPLOAD_FOLDER);

const INPUT_NAME = "admin_photo";
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

// UPLOAD MIDDLEWARE FOR ADMIN PHOTO
const fileUpload = (req, res, next) => {
  const upload = uploadPhoto.single(INPUT_NAME);

  upload(req, res, function (err) {
    if (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        errMsg: err.message,
      });
    }
    // Everything went fine.
    next();
  });
};

// CREATE SUPER ADMIN
router.post("/create-admin", fileUpload, async (req, res) => {
  try {
    const super_admin = await new SuperAdmin({
      ...req.body,
      photo: req?.file?.path,
      role: "SUPER-ADMIN",
    });
    await super_admin.save();

    res.status(200).json({
      success: true,
      message: "Super Admin created successfully!",
      data: super_admin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Fail to create new Super Admin!!",
      errMsg: err.message,
    });
  }
});

// // FIND SUPER ADMIN
// router.get("/all-admin", async (req, res) => {
//   try {
//     const find = await SuperAdmin.find({});

//     res.status(200).json({
//       success: true,
//       message: "Super Admin found successfully!",
//       data: find,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Fail to found new Super Admin!!",
//     });
//   }
// });

router.put("/update-admin/:id", fileUpload, async (req, res) => {
  try {
    // Replace image if it have already
    replacePhoto(SuperAdmin, req);

    const updatedAdmin = await SuperAdmin.findByIdAndUpdate(req.params["id"], {
      ...req.body,
      photo: req?.file?.path,
    });

    res.status(200).json({
      success: true,
      message: "Success to UPDATE the super admin!!",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to UPDATE the super admin!!",
      errMsg: err.message,
    });
  }
});

module.exports = router;
