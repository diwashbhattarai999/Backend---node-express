exports.getPageNotFound = (req, res, next) => {
  res.status(404).render("not-found", {
    docTitle: "Not Found",
    notFoundCSS: true,
    path: req.path,
  });
};
