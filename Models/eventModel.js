const { default: mongoose } = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      // default: "",
    },
    description: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    place: {
      type: String,
      default: "",
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    eventCreator: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("event", eventSchema);

module.exports = Event;
