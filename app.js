const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://root:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.em6f8.mongodb.net/node-rest-shop?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
//is this needed? might be deprecated now?
mongoose.Promise = global.Promise;
//using morgan as a function
app.use(morgan("dev"));
//to make the uploads folder publically accessible(parses the url for /uploads and then make the image static)
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//using CORS (adding a header to allow access)
//CORS error only happen in the browser (not on postmon)
//stops other pages from accessing your API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //to send the browser's reply when we only want to see what headers we have
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//if the incoming requests weren't handled
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 400;
  //forward the error to the next method
  next(error);
});

//will handle all the errors (for unmatching routes and DB fails)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
