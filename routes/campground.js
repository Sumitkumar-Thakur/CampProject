import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import expressError from "../utils/expressError.js";
import Campground from "../models/campground.js";
import { campgroundScheme } from "../schemasVerification.js";
const router = Router();


const validateCampground = (req, res, next) => {
    
    const { error } = campgroundScheme.validate(req.body);
    
    if(error){
        const msg  = error.details.map( e => e.message).join(',')
        throw new expressError(msg, 400);
    }
    next();
}


router.get('/', catchAsync(async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render("./campgrounds/index", { campgrounds })
}))

router.get('/new', (req, res) =>{
    res.render("./campgrounds/new")
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash("success", "Successfully made a new campground!!")
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.get('/:id', catchAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', "Cannot find the campground!!")
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/show', { campground});
    
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
        const id = req.params.id
        const campground = await Campground.findById(id);
        res.render('./campgrounds/edits', { campground });

}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    req.flash("success", "Successfully updated the campground!!")
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndRemove(id, { ...req.body.campground});
    req.flash("success", "Successfully deleted a campground!!")
    res.redirect(`/campgrounds`);
}))


export default router