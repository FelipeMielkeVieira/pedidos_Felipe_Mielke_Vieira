const express = require("express");
const router = express.Router();
const usersController = require("./Users/users.controller");
const productsController = require("./Products/products.controller");
const ordersController = require("./Orders/orders.controller");

router.use("/users", usersController);
router.use("/products", productsController);
router.use("/orders", ordersController);

module.exports = router;