const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const { sortBy } = require("lodash")

exports.getproductId = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "product not found",
                })
            }
            req.product = product
            next();
        })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image file"
            })
        }

        //destructure the fields 
        const { name, stock, category, price, description } = fields
        if (!name ||
            !stock ||
            !category ||
            !price ||
            !description) {
            return res.status(400).json({
                error: "Plese include all fields"
            })
        }

        let product = new Product(fields);

        // handle file here

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // console.log(product);


        //save to db
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Saving tshirt in  db failed"
                })
            }
            res.json(product)
        })


    })
}


exports.getproduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)

}

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, deleteproduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete thr product"
            })
        }
        res.json({
            meassage: "delete was a success",
            deleteproduct
        })
    })

}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image file"
            })
        }

        let product = req.product
        product = _.extend(product, fields)
            // handle file here

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to db
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Updation of product failed"
                })
            }
            res.json(product)
        })


    })
}

// -photo => do not select photo
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([
            [sortBy, "asc"]
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No products found"
                })
            }
            res.json(products)
        })
}

exports.getAllUniqueCategoties = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "No category found "
            })
        }
        res.json(category)
    })
}


exports.updateStock = (req, res, next) => {
    let myOprations = req.body.Order.productd.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }

        }
    })


    Product.bulkWrite(myOprations, {}, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next();
    })
}