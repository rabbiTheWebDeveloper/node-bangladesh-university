// INTERNAL AND EXTERNAL MODULES
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// IMPORTING MY ROUTERS AND USING
const eventRouter = require("./Routes/eventRoutes");
const superAdminRoutes = require("./Routes/superAdminRoutes");
const teacherRoutes = require("./Routes/teacherRoutes");
const studentRoutes = require("./Routes/studentRoutes");
const Auth = require("./Routes/Auth");

// DECLARE in APP
const app = express();
app.use(express.json());
app.use("/event", eventRouter);
app.use("/admin", superAdminRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);
app.use("/auth", Auth);

// MONGODB CONNECTION
mongoose
  .connect(process.env.MONGODB_DATABASE)
  .then(() => {
    console.log("-- Database connecteed!");
  })
  .catch((err) => {
    console.log(err);
    console.log("-- Error to connect database!!");
  });

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// WRONG ROUTE ERROR HANLDER
app.all("*", (req, res) => {
  res.status(500).json({
    success: false,
    message: "Wrong API Route! Please check and try again...",
  });
});

app.listen(process.env.PORT, () => {
  console.log("-- Server is running!");
});
