const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const UserController = require("../controllers/users");

//to get rid of the DeprecationWarning: collection.ensureIndex is deprecated
mongoose.set("useCreateIndex", true);

//sign up
router.post("/signup", UserController.users_signup);
//sign in
router.post("/login", UserController.users_login);

router.delete("/:userId", checkAuth, UserController.users_delete);

module.exports = router;
