const fs = require("fs");
const Teacher = require("../Models/teacherModel");

module.exports = async (Model, req) => {
  if (req?.file) {
    const file = await Model.findById(req.params["id"]);

    if (
      req?.file.mimetype === "image/jpg" ||
      req?.file.mimetype === "image/png" ||
      req?.file.mimetype === "image/jpeg"
    ) {
      const hasPhoto = fs.existsSync(file?.photo);
      if (hasPhoto) {
        fs.unlinkSync(file?.photo);
      }
    } else if (req?.file.mimetype === "application/pdf") {
      const hasCV = fs.existsSync(file?.cv);
      if (hasCV) {
        fs.unlinkSync(file?.cv);
      }
    }
  }
};
