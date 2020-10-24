const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

//multer will execute this function whenever a new file is received (how file should get stored)
//destination (where file should be stored)
//filename (how file should be named)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

//to filter
const fileFilter = (req, file, cb) => {
  //reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Please select a .pnp , .jpeg or .jpg"), false);
  }
};

//limit upload limit to 5MB
const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const Product = require("../models/product");
require("dotenv").config();

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              description: "GET_A_SPECIFIC_PRODUCT",
              url:
                "http://" +
                process.env.HOST +
                ":" +
                process.env.PORT +
                "/products/" +
                doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//to post a product (in postman) (body->raw->{"name":"Water bottle large","price":"12.50"}-> JSON)
router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    productImage: req.file.path,
    price: req.body.price,
  });
  //to store in the DB
  product
    .save()
    .then((result) => {
      const createdProduct = {
        name: result.name,
        price: result.price,
        productImage: result.productImage,
        _id: result._id,
        request: {
          type: "GET",
          description: "GET_A_SPECIFIC_PRODUCT",
          url:
            "http://" +
            process.env.HOST +
            ":" +
            process.env.PORT +
            "/products/" +
            result._id,
        },
      };
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: createdProduct,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//error message - "No valid entry fount for provided ID" for unmatching ObjectIds
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET_ALL_PRODUCTS",
            url:
              "http://" +
              process.env.HOST +
              ":" +
              process.env.PORT +
              "/products/",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry fount for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//req body should be an array in key value pairs
router.patch("/:productId", checkAuth,(req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  //second param- how we want to update ($set)
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          description: "GET_A_SPECIFIC_PRODUCT",
          url:
            "http://" +
            process.env.HOST +
            ":" +
            process.env.PORT +
            "/products/" +
            id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId",checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url:
            "http://" +
            process.env.HOST +
            ":" +
            process.env.PORT +
            "/products/",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
