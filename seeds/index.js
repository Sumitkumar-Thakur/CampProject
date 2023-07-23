
import path from 'path';
import { Campground }  from '../models/campground.js';
import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 12000)
        const camp = new Campground({
            author: '64bc2f2b6737d87d0940a135',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251/1600x900',
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit ratione tempore esse quod libero inventore aliquid dolores illo, odio veritatis quisquam architecto quos nesciunt illum blanditiis mollitia distinctio alias quia? Adipisci dolores alias libero laborum at officia temporibus numquam. Libero ut accusantium magni vel perspiciatis rerum. Perferendis, debitis. Molestiae aspernatur rerum facere qui quibusdam accusantium sint minus consequatur voluptates adipisci! Voluptates dicta sunt possimus rem harum impedit voluptas perspiciatis odio modi ex magnam perferendis, sapiente repellat illo tenetur cum accusamus omnis? Commodi rem dolores eum, quam necessitatibus ea numquam dolor.",
            price
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});