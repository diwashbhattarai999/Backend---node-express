const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
require("dotenv").config();
const { validationResult } = require("express-validator");

const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: message,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      docTitle: "Login",
      errorMessage: null,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        docTitle: "Login",
        errorMessage: "Invalid email or password!",
        oldInput: { email, password },
        validationErrors: [],
      });
    }

    bcrypt
      .compare(password, user.password)
      .then((isMatched) => {
        if (isMatched) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.status(422).render("auth/login", {
          path: "/login",
          docTitle: "Login",
          errorMessage: "Invalid email or password!",
          oldInput: { email, password },
          validationErrors: [],
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(422).render("auth/login", {
          path: "/login",
          docTitle: "Login",
          errorMessage: "Invalid email or password!",
          oldInput: { email, password },
          validationErrors: [],
        });
      });
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  let successMessage = req.flash("success");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage,
    successMessage,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      errorMessage: null,
      successMessage: null,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      req.flash("success", "Registered Suceesfull! Please Login");
      setTimeout(() => {
        res.redirect("/login");
      }, 2000);
      return mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "diwashb999@gmail.com",
              Name: "हाम्रो DOKAAN",
            },
            To: [
              {
                Email: email,
                Name: "You",
              },
            ],
            Subject: "Signup succeeded!",
            TextPart: "Greetings from हाम्रो DOKAAN!",
            HTMLPart: `
                  <div>
                    <h1>You successfully signed up!</h1> 
                    <a href="http://localhost:3000/login" >Click here</a> 
                    to login
                  </div>
                `,
          },
        ],
      });
    })
    .catch((err) => {
      req.flash("error", "Something went wrong!");
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error");
  let successMessage = req.flash("success");

  errorMessage = errorMessage.length > 0 ? errorMessage[0] : null;
  successMessage = successMessage.length > 0 ? successMessage[0] : null;

  res.render("auth/reset", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage,
    successMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
      })
      .then((result) => {
        req.flash("success", "Please check your email for password reset");
        res.redirect("/reset");
        return mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: "diwashb999@gmail.com",
                Name: "हाम्रो DOKAAN",
              },
              To: [
                {
                  Email: req.body.email,
                  Name: "You",
                },
              ],
              Subject: "Password reset!",
              TextPart: "Greetings from हाम्रो DOKAAN!",
              HTMLPart: `
                <div>
                  <h1>You requested a password reset!</h1> 
                  <a href="http://localhost:3000/reset/${token}" >Click here</a> 
                  to reset your password.
                </div>
              `,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let errorMessage = req.flash("error");
      let successMessage = req.flash("success");

      errorMessage = errorMessage.length > 0 ? errorMessage[0] : null;
      successMessage = successMessage.length > 0 ? successMessage[0] : null;

      res.render("auth/new-password", {
        path: "/new-password",
        docTitle: "New Password",
        errorMessage,
        successMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      console.log("Redirecting to login...");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
