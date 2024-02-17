const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  getCheckoutSuccess,
  getInvoice,
} = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", getIndex);
router.get("/products", getProducts);
router.get("/product/:productId", getProduct);

router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);
router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.get("/orders", isAuth, getOrders);
router.get("/checkout", isAuth, getCheckout);
router.get("/checkout/success", isAuth, getCheckoutSuccess);
router.get("/checkout/cancel", isAuth, getCheckout);

router.get("/orders/:orderId", isAuth, getInvoice);

module.exports = router;
