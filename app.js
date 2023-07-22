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
import Joi from "joi";
import { campgroundScheme, reviewSchema } from "./schemasVerification.js";
import  Review from "./models/review.js"
import reviews from "./routes/reviews.js";
import campground from "./routes/campground.js";
import flash from "connect-flash";
import session from "express-session";
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: process.env.secret_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds", campground)
app.use("/campgrounds/:id/reviews", reviews)


app.get('/', (req, res) =>{
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new expressError("Page Not Found" , 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong";
    res.status(statusCode).render("error", {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})