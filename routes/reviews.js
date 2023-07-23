import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import  Review from "../models/review.js"
import { validateReview, isLoggedIn, isReviewAuthor} from "../middleware.js";
const router = Router({mergeParams: true});



router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Submitted a new review!!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, 
        { $pull: { reviews: req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Successfully deleted a review!!")
    res.redirect(`/campgrounds/${campground._id}`)
}))


export default router