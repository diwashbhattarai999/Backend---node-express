const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isAuthenticated = req.get("Cookie").split(";")[0].trim().split("=")[1];
  // console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true");
  User.findById("65b1200719414a4833981da8").then((user) => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
