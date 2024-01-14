const express = require("express");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
} = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", getAddProduct);
router.post("/add-product", postAddProduct);
router.get("/products", getProducts);

exports.routes = router;
