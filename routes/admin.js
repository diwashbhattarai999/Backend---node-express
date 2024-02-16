const express = require("express");
const { check, body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);
router.post(
  "/add-product",
  [
    body(
      "title",
      "Please enter a title with at least 3 alphanumeric characters."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Please enter a valid price.").isFloat(),
    body(
      "description",
      "Please enter a description with at least 3 characters."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
  ],
  isAuth,
  postAddProduct
);

router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body(
      "title",
      "Please enter a title with at least 3 alphanumeric characters."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Please enter a valid price.").isFloat(),
    body(
      "description",
      "Please enter a description with at least 3 characters."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
  ],
  isAuth,
  postEditProduct
);

router.delete("/product/:productId", isAuth, deleteProduct);

exports.routes = router;
