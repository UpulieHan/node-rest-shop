const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductsController = require("../controllers/products");
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

require("dotenv").config();

router.get("/", ProductsController.products_get_all);

//to post a product (in postman) (body->raw->{"name":"Water bottle large","price":"12.50"}-> JSON)
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);

//error message - "No valid entry fount for provided ID" for unmatching ObjectIds
router.get("/:productId", ProductsController.products_get_product);

//req body should be an array in key value pairs
router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;
