import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { isLoggedIn , isAuthor, validateCampground} from "../middleware.js";
import review from "../models/review.js";
const router = Router();


router.get('/', catchAsync(async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render("./campgrounds/index", { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) =>{
    
    res.render("./campgrounds/new")
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save()
    req.flash("success", "Successfully made a new campground!!")
    res.redirect(`/campgrounds/${campground.id}`)
}))

router.get('/:id', catchAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }}).populate('author');
    if(!campground){
        req.flash('error', "Cannot find the campground!!")
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/show', { campground});
    
}))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
        const id = req.params.id
        const campground = await Campground.findById(id);
        if(!campground){
            req.flash('error', "Cannot find the campground!!")
            return res.redirect('/campgrounds');
        }
        res.render('./campgrounds/edits', { campground });

}))



router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    req.flash("success", "Successfully updated the campground!!")
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id);
    await Campground.findByIdAndRemove(id, { ...req.body.campground});
    req.flash("success", "Successfully deleted a campground!!")
    res.redirect(`/campgrounds`);
}))


export default router