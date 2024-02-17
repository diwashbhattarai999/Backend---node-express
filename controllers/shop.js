const path = require("path");
const Stripe = require("stripe")(
  "sk_test_51OkN9dSDLHuOu92tl364oPlrHqklpnZEgTr1PbXKILyQtFtVlLgPpOslnIiEN2AbiIJoNdhDyoKqjohCWocumjiR008Rbu1LmE"
);

const Product = require("../models/product");
const Order = require("../models/order");
const { createInvoice } = require("../utils/createInvoice");

const ITEMS_PER_PAGE = 4;

exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1;
  const skip = ITEMS_PER_PAGE * (page - 1);
  let totalProducts;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find().skip(skip).limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        currentPage: +page,
        totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        docTitle: product.title,
        path: "/product",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = req.query.page || 1;
  const skip = ITEMS_PER_PAGE * (page - 1);
  let totalProducts;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalProducts = numProducts;
      return Product.find().skip(skip).limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/shop",
        currentPage: +page,
        totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      total = 0;
      products.forEach((product) => {
        total += product.quantity * product.productId.price;
      });

      // console.log(products);
      return Stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            price_data: {
              currency: "inr",
              unit_amount: p.productId.price * 100,
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
            },
            quantity: p.quantity,
          };
        }),
        mode: "payment",
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      // console.log(session);
      res.render("shop/checkout", {
        path: "/checkout",
        docTitle: "Checkout",
        products: products,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized."));
      }

      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      //   res.send(data);
      // });

      // const pdfDoc = new PDFDocument();
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      // pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // pdfDoc.pipe(res);

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      // file.pipe(res);

      const subtotal = order.products.reduce((acc, product) => {
        return acc + product.quantity * product.product.price;
      }, 0);

      const invoice = {
        shipping: {
          name: req.user.email,
          address: "1234 Main Street",
          city: "Dudhpati, Bhaktapur",
          state: "Bagmati",
          country: "NP",
          postal_code: 94111,
        },
        items: order.products,
        subtotal,
        paid: 0,
        invoice_nr: order._id,
      };

      createInvoice(invoice, invoicePath, res);
    })
    .catch((err) => {
      console.log(err);
    });
};
