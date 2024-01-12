const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "not-found.html"));
});

// app.use((req, res, next) => {
//   console.log("In the middleware");
//   next(); //Allows the request to continue to the next middleware in line
// });

// app.use("/", (req, res, next) => {
//     console.log("This always runs no matter what the route is");
//   next();
// });

// app.use("/product", (req, res, next) => {
//   console.log(req.body);
//   res.redirect("/");
// });

// This middleware only triggers for get request
// app.get("/product", (req, res, next) => {
//   console.log(req.body);
//   res.redirect("/");
// });

// This middleware only triggers for post request
// app.post("/product", (req, res, next) => {
//     console.log(req.body);
//     res.redirect("/");
//   });

// app.use("/", (req, res, next) => {
//   //   console.log("In the another middleware");
//   res.send("<h1>Hello from express</h1>");
// });

app.listen(3000);
