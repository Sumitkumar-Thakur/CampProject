import mongoose from "mongoose";
import { Review } from "./review.js";
const Schema = mongoose.Schema;

const CampgroundScheme = new Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

CampgroundScheme.post('findOneAndDelete', async function (doc){
    if(doc){
        await Review.remove({
            _id : {
                $in: doc.reviews
            }
        })
    }
})


export const Campground = mongoose.model('Campground', CampgroundScheme);
export default Campground