const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in db",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "not able to save category in db",
      });
    }
    res.json({
      category,
    });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No categoriies found",
      });
    }
    res.json(category);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updateCategory) => {
    if (err) {
      return res.status(400).json({
        error: "failed to update category",
      });
    }
    res.json(updateCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "category not found in db",
      });
    }
    res.json({
      message: `successfull deleted ${category.name}`,
    });
  });
};
