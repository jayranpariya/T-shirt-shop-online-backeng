const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { getUserById, getUser, updateUser, userPuchaseList } = require('../controllers/user')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')


router.param("userId", getUserById)


router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)


router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)

router.put("/orders/user/:userId", isSignedIn, isAuthenticated, userPuchaseList)
//assinment
// router.get("/users/", (req, res) => {
//     User.find().exec((err, user) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 error: " user date  not found in db"
//             })
//         }

//         for (i = 0; i < user.length; i++) {
//             user[i].salt = undefined;
//             user[i].encry_password = undefined;
//             user[i].createdAt = undefined;
//             user[i].updatedAt = undefined;
//         }

//         res.json({
//             user: user,
//         })
//     })
// })


module.exports = router