import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampgroundScheme = new Schema({
    title : String,
    price : String,
    description : String,
    location : String,
});

export const Campground = mongoose.model('Campground', CampgroundScheme);
export default Campground