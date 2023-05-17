const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')



//routes using controller
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.postReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;




// router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.author = req.user._id
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     req.flash('success', 'Created new review');
//     res.redirect(`/campgrounds/${campground._id}`);
// }))
//when we first try adding a review we hit an error saying cannot read properties of null i.e
//this is because we have prefixed the id of campground in middleware in the app.js file but here the router does not have access to it
//se we set the mergeparams option when creating a router object to be true
//This gives access to the router object even to the defoned router middleware id⚠️❗❗


// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     //pull operator will go insde reviews array of the campground and pull anything matching reviewId
//     //So here we are first deleting the reference to that review from a particular campground and then deleting the review itself
//     await Review.findByIdAndDelete(reviewId);
//     req.flash('success', 'Successfully deleted review');
//     res.redirect(`/campgrounds/${id}`);
// }))

// module.exports = router;

