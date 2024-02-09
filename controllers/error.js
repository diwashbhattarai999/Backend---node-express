exports.getPageNotFound = (req, res, next) => {
  res.status(404).render("not-found", {
    docTitle: "Page Not Found",
    notFoundCSS: true,
    path: req.path,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render("500", {
    docTitle: "Error",
    notFoundCSS: true,
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
