const { default: mongoose } = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    teacherID: {
      type: String,
      required: true,
      unique: true,
      //   default: "",
    },

    name: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    religion: {
      type: String,
      default: "",
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    birth_date: {
      type: Date,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    nid: {
      type: String,
      default: "",
    },

    faculty: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    
    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    academicQualification: {
      type: String,
      default: "",
    },

    trainingExprience: {
      type: String,
      default: "",
    },

    teachingArea: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      default: "password",
    },

    role: {
      type: String,
      default: "TEACHER",
      immutable: true,
    },

    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("teacher", teacherSchema);

module.exports = Teacher;
