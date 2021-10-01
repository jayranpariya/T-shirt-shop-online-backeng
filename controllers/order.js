const { Order, ProductCart } = require('../models/order')

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.Product', "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({ error: "no order found in db" });
            }
            res.order = order
            next();
        })
}


exports.createOrde = (req, res) => {
    // bugs
    req.body.order.user = req.profile
    const order = new Order(req.bode.order)
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({ error: "failed to save your order in db" });
        }
        res.json(order)
    })
}


exports.getAllOrder = (req, res) => {
    Order.find().populate('user', '_id name ').exec((err, order) => {
        if (err) {
            return res.status(400).json({ error: "No order found in db" });
        }
        res.json(order)
    })
}

exports.updateStatus = (req, res) => {
    //
    Order.updateOne({ _id: req.bodyorderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({ error: "Cannot update order status" });
        }
        res.json(order)
    })
}

exports.getOrderStatys = (req, res) => {
    //
    rea.json(Order.schema.path("status").enumValuse)
}