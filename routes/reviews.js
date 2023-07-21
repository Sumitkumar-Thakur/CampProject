import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import expressError from "../utils/expressError.js";
import Campground from "../models/campground.js";
import  Review from "../models/review.js"
import { reviewSchema } from "../schemasVerification.js";
const router = Router({mergeParams: true});

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if(error){
        const msg  = error.details.map( e => e.message).join(',')
        throw new expressError(msg, 400);
    }
    next();

}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, 
        { $pull: { reviews: req.params.reviewId}});
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${campground._id}`)
}))


export default router