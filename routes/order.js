const express = require('express');
const router = express.Router();
const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth')
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user')
const { updateStock } = require('../controllers/product');


const { getOrderById, createOrde, getAllOrder, getOrderStatys, updateStatus } = require('../controllers/order');

//params
router.param("userId", getUserById)
router.param("orderId", getOrderById)

//router
router.post('/order/create/:userId', isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrde)


router.get('/order/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrder)

//status of order
router.get('/order/status/:userId', isSignedIn, isAuthenticated, isAdmin, getOrderStatys)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)

module.exports = router;