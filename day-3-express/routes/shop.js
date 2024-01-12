const express = require("express");

const path = require("path");

const rootDir = require("../utils/path");
const adminData = require("./admin.js");

const router = express.Router();

router.get("/", (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  const products = adminData.products;
  res.render("shop", { prods: products, docTitle: "Shop", path: "/shop" });
});

module.exports = router;
