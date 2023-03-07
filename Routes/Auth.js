const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Student = require("../Models/studentModel");
const Teacher = require("../Models/teacherModel");
const SuperAdmin = require("../Models/superAdminModel");

// const test = async () => {
//   const password = "password";
//   const findUser = await SuperAdmin.findOne({ adminID: "iksagor" });

//   if (password === findUser?.password) {
//     console.log(findUser);
//   } else {
//     console.log("Wrong Password!");
//   }
// };
// test();

router.post("/login", async (req, res, next) => {
  try {
    // FINDING USER
    let findUser = await Student.findOne({ studentID: req.body.id });
    let userID = findUser?.studentID;
    if (!findUser) {
      findUser = await Teacher.findOne({ teacherID: req.body.id });
      userID = findUser?.teacherID;
    }
    if (!findUser) {
      findUser = await SuperAdmin.findOne({ adminID: req.body.id });
      userID = findUser?.adminID;
    }

    if (!findUser) {
      // THROW ERROR!! IF USER NOT FOUND ANYWHERE
      throw new Error("User Not Found!");
    } else {
      // MATCH PASSWORD
      if (req?.body?.password === findUser?.password) {
        if (findUser?.role !== "SUPER-ADMIN") {
          const isActive = findUser?.activeStatus;

          if (!isActive) {
            // THROW ERROR!! IF USER "activeStatus === false"
            throw new Error(
              "Your account is disabled. Please contact with authorities."
            );
          }
        }

        // ***** IF AUTHENTICATION SUCESS *****
        const user = {
          userID,
          name: findUser?.name,
          role: findUser?.role,
          loginTime: Date.now(),
          id: findUser?.id,
        };

        const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });

        res.status(200).json({
          success: true,
          message: "Authentication Successful.",
          token,
          user,
        });
      } else {
        // THROW ERROR!! IF PASSWORD NOT MATCHED
        throw new Error("Wrong Password!");
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Authentication Failed!! ${err.message}`,
    });
  }
});

// router.post("/test_authorization", (req, res) => {
//   const authorization = req?.headers?.authorization;
//   const decodeUser = jwt.decode(authorization, process.env.JWT_SECRET_KEY);

//   if (decodeUser && decodeUser.userID === req.body.id) {
//     console.log(decodeUser);
//     res.json(decodeUser);
//   } else {
//     console.log("Authorization Failer");
//     res.json("Authorization Failer");
//   }
// });

module.exports = router;
