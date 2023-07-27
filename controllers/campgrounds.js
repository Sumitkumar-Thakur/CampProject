import Campground from "../models/campground.js";
import cloudinary from "../cloudinary/index.js";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import constants from '../config/contants.js';

const { mapboxToken } = constants; 
const geocoder = mbxGeocoding({accessToken: mapboxToken})

export const index = async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render("./campgrounds/index", { campgrounds })
}

export const renderNewForm = (req, res) =>{
    
    res.render("./campgrounds/new")
}

export const createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save()
    console.log(campground)
    req.flash("success", "Successfully made a new campground!!")
    res.redirect(`/campgrounds/${campground.id}`)
}

export const showCampground = async (req, res) =>{
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
    
}

export const renderEditForm = async(req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', "Cannot find the campground!!")
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edits', { campground });

}

export const updateCampground = async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({pull: {images: { filename: { $in: req.body.deleteImages}}}})
    }
    req.flash("success", "Successfully updated the campground!!")
    res.redirect(`/campgrounds/${campground._id}`);

}

export const deleteCampground = async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id);
    await Campground.findByIdAndRemove(id, { ...req.body.campground});
    req.flash("success", "Successfully deleted a campground!!")
    res.redirect(`/campgrounds`);
}

export default {
    index,
    renderNewForm,
    createCampground,
    showCampground,
    renderEditForm,
    updateCampground,
    deleteCampground
};