const express = require("express");
const { check, body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
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
    body(
      "imageUrl",
      "Please enter a valid image URL with a length between 5 and 400 characters."
    )
      .isString()
      .isLength({ min: 5, max: 400 })
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
    body(
      "imageUrl",
      "Please enter a valid image URL with a length between 5 and 400 characters."
    )
      .isString()
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  postEditProduct
);

router.post("/delete-product", isAuth, postDeleteProduct);

exports.routes = router;
