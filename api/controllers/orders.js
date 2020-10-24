const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              description: "GET_ALL_ORDERS",
              url:
                "http://" +
                process.env.HOST +
                ":" +
                process.env.PORT +
                "/orders/" +
                doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_create_order = (req, res, next) => {
  //to see if productId already exists
  Product.findById(req.body.productId)
    .then((product) => {
      //if product is null
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      const createdOrder = {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
        request: {
          type: "GET",
          description: "GET_SPECIFIC_ORDER",
          url:
            "localhost://" +
            process.env.HOST +
            ":" +
            process.env.PORT +
            "/orders/" +
            result._id,
        },
      };
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: createdOrder,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("_id product quantity")
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url:
            "http://" +
            process.env.HOST +
            ":" +
            process.env.PORT +
            "/orders/" +
            id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url:
            "localhost://" +
            process.env.HOST +
            ":" +
            process.env.PORT +
            "/orders/",
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
