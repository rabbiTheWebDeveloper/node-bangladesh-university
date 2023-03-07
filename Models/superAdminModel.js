const { default: mongoose } = require("mongoose");

const superAdminSchema = mongoose.Schema({
  adminID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "",
  },
  photo: {
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

  password: {
    type: String,
    default: "password",
  },
  role: {
    type: String,
    default: "SUPER-ADMIN",
    // enum: "SUPER-ADMIN",
    immutable: true,
  },
});

const SuperAdmin = mongoose.model("super-admin", superAdminSchema);

module.exports = SuperAdmin;
