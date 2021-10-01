const express = require('express');
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');
const { check } = require('express-validator');

router.post('/signup', [
    check('name', "name sholud be at least 3 char").isLength({ min: 3 }),
    check('email', "email is require").isEmail(),
    check('password', "password is require and should be at least 3 char").isLength({ min: 3 }),
], signup);


router.post('/signin', [
    check('email', "email is require").isEmail(),
    check('password', "password is require and should be at least 3 char").isLength({ min: 3 }),
], signin);


router.get('/testroute', isSignedIn, (req, res) => {
    res.json(req.auth);
})




router.get('/signout', signout)


module.exports = router;