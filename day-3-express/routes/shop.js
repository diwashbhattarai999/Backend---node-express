const express = require("express");

const path = require("path");

const rootDir = require("../utils/path");
const adminData = require("./admin.js");

const router = express.Router();

router.get("/", (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    docTitle: "Shop",
    path: "/shop",
    hasProducts: products.length > 0,
    shopCSS: true,
    activeShop: true,
  });
});

module.exports = router;
