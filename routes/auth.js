const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/user");

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);
router.post(
  "/login",
  [
    body("email", "Please enter a valid email.").isEmail().normalizeEmail(),
    body("password", "Please enter the password ").isLength({ min: 1 }).trim(),
  ],
  postLogin
);

router.get("/signup", getSignup);
router.post(
  "/signup",
  [
    check("email", "Please enter a valid email.")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already in use! Please use different email address"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and letters with at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  postSignup
);

router.post("/logout", postLogout);

router.get("/reset", getReset);
router.post("/reset", postReset);
router.get("/reset/:token", getNewPassword);
router.post("/new-password", postNewPassword);

module.exports = router;
