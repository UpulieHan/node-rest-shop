const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all = (req, res, next) => {
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
};

exports.products_create_product = (req, res, next) => {
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
};

exports.products_get_product = (req, res, next) => {
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
};

exports.products_update_product = (req, res, next) => {
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
};

exports.products_delete = (req, res, next) => {
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
};
