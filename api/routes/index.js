const { Router } = require("express");

const auth = require("./auth.route.js");
const users = require("./users.route.js");
const products = require("./products.route.js");
const categories = require("./categories.route.js");
const googleDrive = require("./google-drive.route.js");

const router = Router();
router.use("/auth", auth);
router.use("/users", users);
router.use("/products", products);
router.use("/categories", categories);
router.use("/google-drive", googleDrive);

module.exports = router;