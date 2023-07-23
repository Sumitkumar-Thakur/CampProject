import Campground from "../models/campground.js";
import  Review from "../models/review.js"

export const createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Submitted a new review!!")
    res.redirect(`/campgrounds/${campground._id}`)
}

export const deleteReview = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, 
        { $pull: { reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted a review!!")
    res.redirect(`/campgrounds/${campground._id}`)
}

export default {
    createReview,
    deleteReview
}