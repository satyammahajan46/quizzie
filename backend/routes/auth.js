const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Minimum length is 8"),
    body("cPassword")
      .trim()
      .custom((value, { req }) => {
        if (value === req.body.password) {
          return value;
        } else {
          throw new Error("Password don't match");
        }
      }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 8 }),
  ],
  authController.login
);

module.exports = router;
