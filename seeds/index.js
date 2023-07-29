
import path from 'path';
import { Campground }  from '../models/campground.js';
import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import review from '../models/review.js';
dotenv.config();

mongoose.connect(process.env.MONGO_PROD_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', async () => {
    console.log('DB connected successfully');
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDb = async() => {
    await Campground.deleteMany({});
    await review.deleteMany({});
    for(let i = 0; i < 10; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        
    const camp = new Campground({
    author: '64bc2f2b6737d87d0940a135',
    location: `${cities[random1000].city}, ${cities[random1000].state}`,
    title: `${sample(descriptors)} ${sample(places)}`,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
    price: price,
    geometry: {
        type: "Point",
        coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
        ]
    },
    images: [
        {
            url : 'https://res.cloudinary.com/dlxdgvmki/image/upload/v1690228808/samples/landscapes/nature-mountains.jpg',
            filename: 'nature-mountains'
        },
        {
            url : 'https://res.cloudinary.com/dlxdgvmki/image/upload/v1690228823/cld-sample-2.jpg',
            filename: 'cld-sample-2'
        }
    ]
})
await camp.save();
}
}

seedDb().then(() => {
    mongoose.connection.close()
});