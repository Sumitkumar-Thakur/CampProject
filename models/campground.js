import mongoose from "mongoose";
import { Review } from "./review.js";
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true} };

const CampgroundScheme = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundScheme.virtual('properties.popUpMarkup').get(function (){
    return `<b><a href="/campgrounds/${this._id}">${this.title}</a></b>
    <p><b>$</b>${this.price}/night</p>`
})


CampgroundScheme.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.remove({
            _id : {
                $in: doc.reviews
            }
        });
        if(doc.images.length > 0){
            for (let img of doc.images) {
                await cloudinary.uploader.destroy(img.filename);
            }
        }
    }
})


export const Campground = mongoose.model('Campground', CampgroundScheme);
export default Campground