const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "SG.2deuDoZlQ0e2gDTnKGsesA.0SGsfE7IEE0fLsDo5kfCf_w7S265DYfN2mu7oNs0uBo",
    },
  })
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
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid credentials!");
      return res.redirect("/login");
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
        req.flash("error", "Invalid credentials!");
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", "Invalid credentials!");
        res.redirect("/login");
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
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already in use!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          req.flash("success", "Registered Suceesfull! Please Login");
          res.redirect("/signup");
          return transporter.sendMail({
            to: email,
            from: "diwashb999@gmail.com",
            subject: "Signup succeeded!",
            html: `<div><h1>You successfully signed up!</h1> <a href="http://localhost:4000/login" >Click here</a> to login</div>`,
          });
        })
        .catch((err) => {
          console.log(err);
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
