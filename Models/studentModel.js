const { default: mongoose } = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    studentID: {
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

    fatherName: {
      type: String,
      default: "",
    },

    motherName: {
      type: String,
      default: "",
    },

    guardianName: {
      type: String,
      default: "",
    },

    guardianPhone: {
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

    admission_date: {
      type: Date,
      default: "",
    },

    batch: {
      type: String,
      default: "",
    },

    session: {
      type: String,
      default: "",
    },

    semester: {
      type: String,
      default: "",
    },

    group: {
      type: String,
      default: "",
    },

    nid: {
      type: String,
      default: "",
    },

    permanentAddress: {
      type: String,
      default: "",
    },

    presentAddress: {
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

    cv: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "STUDENT",
      // enum: "STUDENT",
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

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
