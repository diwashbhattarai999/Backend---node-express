exports.getPageNotFound = (req, res, next) => {
  res.status(404).render("not-found", {
    docTitle: "Page Not Found",
    notFoundCSS: true,
    path: req.path,
    isAuthenticated: req.session.isLoggedIn,
  });
};
