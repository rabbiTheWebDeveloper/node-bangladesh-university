const Event = require("../Models/eventModel");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const replacePhoto = require("../Common/replacePhoto");
const deleteFile = require("../Common/deleteFile");
const autoCreateFolder = require("../Common/autoCreateFolder");
const router = express.Router();

// MULTER DECLARATIONS
const UPLOAD_FOLDER = __dirname + "/../Uploads/EventsPhotos/";
autoCreateFolder(UPLOAD_FOLDER);

const INPUT_NAME = "event_photo";
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

// UPLOAD MIDDLEWARE FOR EVENT PHOTO
const fileUpload = (req, res, next) => {
  const upload = uploadPhoto.single(INPUT_NAME);

  upload(req, res, function (err) {
    if (err) {
      res.status(400).json({
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

// CREATE EVENT ROUTE
router.post("/create", fileUpload, async (req, res) => {
  try {
    const newData = await new Event({ ...req.body, photo: req?.file?.path });
    await newData.save();

    res.status(200).json({
      success: true,
      message: "Event created successfully!",
      createdData: newData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Fail to create new Event!!",
      errMsg: err.message,
    });
  }
});

// FIND ALL EVENT ROUTE
router.get("/all", async (req, res) => {
  try {
    const allEvents = await Event.find({}).sort({ createdAt: -1 });

    res.status(200).json(allEvents);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to find event data!!",
      errMsg: err.message,
    });
  }
});

// FIND ONE EVENT ROUTE
router.get("/find/:id", async (req, res) => {
  try {
    const event = await Event.findById(req?.params?.id);

    res.status(200).json(event);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to find event data!!",
      errMsg: err.message,
    });
  }
});

// DELETE EVENT ROUTE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedData = await Event.findByIdAndDelete(req?.params?.id);

    res.status(200).json({
      success: true,
      message: "Success to DELETE the event!!",
      deletedData,
    });

    // DELETE PHOTO FROM STORAGE
    deleteFile(deletedData?.photo);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to DELETE the event!!",
      errMsg: err.message,
    });
  }
});

// UPDATE EVENT ROUTE
router.put("/update/:id", fileUpload, async (req, res) => {
  try {
    // Replace image if it have already
    replacePhoto(Event, req);

    const updatedData = await Event.findByIdAndUpdate(req?.params?.id, {
      ...req.body,
      photo: req?.file?.path,
    });

    res.status(200).json({
      success: true,
      message: "Success to UPDATE the event!!",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: "Fail to UPDATE the event!!",
      errMsg: err.message,
    });
  }
});

// Export All routes
module.exports = router;
