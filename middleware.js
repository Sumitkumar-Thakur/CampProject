import Campground from "./models/campground.js"
import expressError from "./utils/expressError.js"
import { campgroundScheme, reviewSchema } from "./schemasVerification.js";
import { Review } from "./models/review.js";

export const isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signedIn!!')
        return res.redirect('/login')
    }
    next();
}
export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

export const isAuthor = async( req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission to do that')
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

export const isReviewAuthor = async( req, res, next) => {
    const { id, reviewId }= req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

export const validateCampground = (req, res, next) => {
    
    const { error } = campgroundScheme.validate(req.body);
    
    if(error){
        const msg  = error.details.map( e => e.message).join(',')
        throw new expressError(msg, 400);
    }
    next();
}

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if(error){
        const msg  = error.details.map( e => e.message).join(',')
        throw new expressError(msg, 400);
    }
    next();

}