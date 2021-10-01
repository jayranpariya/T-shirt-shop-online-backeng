const User = require("../models/user")
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt');
const { use } = require("../routes/auth");



exports.signup = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    const user = new User(req.body)
        // db save user
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({ err: "Not able to save user in db" })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id,
        });
    });
}


exports.signout = (req, res) => {
    res.clearCookie("tokrn")
    res.json({
        message: "user signed out successfully",
    })
}



exports.signin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "user email not found" })
        }


        if (!user.autheticate(password)) {
            return res.status(401).json({ error: "email and password do not match" })
        }

        //CREATE token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET)


        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 })

        //send res to front end
        const { _id, name, email, role } = user
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        })
    })
}

//protected toutes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})


//coustom middlewares
exports.isAuthenticated = (req, res, next) => {

    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({ error: "Access denied" })
    }
    next();
}
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({ error: "you are not admin , access denied" })
    }
    next();
}