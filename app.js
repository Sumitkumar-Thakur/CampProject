import express from "express";
import path from 'path';
import bodyParser from 'body-parser';
import { Campground }  from './models/campground.js';
import mongoose from "mongoose";
import  methodOverride from "method-override";
import dotenv from 'dotenv';
import ejsMate from "ejs-mate";
import catchAsync from "./utils/catchAsync.js";
import expressError from "./utils/expressError.js";
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
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render("./campgrounds/index", { campgrounds })
}))

app.get('/campgrounds/new', (req, res) =>{
    res.render("./campgrounds/new")
})

app.post('/campgrounds', catchAsync(async (req, res) => {
    if(!req.body.campground) throw new expressError("Invalid Campground Data" , 400)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id);
    res.render('./campgrounds/show', { campground });
    
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
        const id = req.params.id
        const campground = await Campground.findById(id);
        res.render('./campgrounds/edits', { campground });

}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);

}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    
        const campground = await Campground.findByIdAndRemove(id, { ...req.body.campground});
        res.redirect(`/campgrounds`);
}))

app.all('*', (req, res, next) => {
    next(new expressError("Page Not Found" , 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!!"} = err;
    res.status(statusCode).send(message);
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})