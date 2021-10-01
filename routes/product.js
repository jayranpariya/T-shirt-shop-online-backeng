const express = require('express');
const router = express.Router();

// comyrollers
const { getproductId, createProduct, getproduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategoties } = require('../controllers/product')
const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

//all of param
router.param("userId", getUserById)
router.param("productId", getproductId)

//all of actual router

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)


//read router
router.get("/product/:productId", getproduct)
router.get("/product/photo/:productId", photo)


//delete router
router.delete("/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct)


//update router
router.put("/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct)

//listing router

router.get("/products", getAllProducts)
router.get("/products/categoties", getAllUniqueCategoties)

module.exports = router