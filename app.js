import express from "express";
import path from 'path';
import bodyParser from 'body-parser';
import { Campground }  from './models/campground.js';
import mongoose from "mongoose";
import  methodOverride from "method-override";
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_PROD_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', async () => {
    console.log('DB connected successfully');
})


const __dirname = path.resolve();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render("./campgrounds/index", { campgrounds })
})

app.get('/campgrounds/new', async (req, res) =>{
    res.render("./campgrounds/new")
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
})

app.get('/campgrounds/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const campground = await Campground.findById(id);
        res.render('./campgrounds/show', { campground });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/campgrounds/:id/edit', async(req, res) => {
        const id = req.params.id
        const campground = await Campground.findById(id);
        res.render('./campgrounds/edits', { campground });

})

app.put('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.delete('/campgrounds/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const campground = await Campground.findByIdAndRemove(id, { ...req.body.campground});
        res.redirect(`/campgrounds`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})