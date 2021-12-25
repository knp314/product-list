const router = require("express").Router();
const Product = require("../models/product");
const Review = require("../models/review");

// Query parameter function to return review given a review id
router.param("review", (req, res, next, id) => {
  Review.findById(id).exec((err, review) => {
    if (err) {
      console.log(err.message);
      return res.status(404).send('Review not found');
    } else if (review) {
      req.review = review;
      next();
    } else {
      return res.status(404).send('Review not found');
    }
  });
});

// DELETE /reviews/:review route - Deletes a review by id
router.delete("/reviews/:review", (req, res, next) => {
  // delete review by its ID and delete review from associated product's reviews array
  Review.findByIdAndDelete(req.review._id, (err, review) => {
    if (err) throw err;
    Product.findByIdAndUpdate(
      req.review.product,
      { $pull: { reviews: review._id }},
      (err) => {
        if (err) throw err;
        res.send(review)
    });
  });
});

module.exports = router;