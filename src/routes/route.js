const express = require("express");
const router = express.Router();

const { createCustomer,customerLogin,getCustomer} = require('../controllers/customerController');

const {authentication, authorization } = require('../middlewares/auth')
const {createOrder } = require("../controllers/orderController")


//----------------------------- customer's API -----------------------------//

router.post("/register", createCustomer);
router.post("/login",customerLogin);
router.get("/customer/:customerId", authentication,authorization,getCustomer)
router.post("/order/:customerId",authentication,authorization,createOrder)











module.exports = router;