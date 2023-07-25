import express from "express";
import path from 'path';
import bodyParser from 'body-parser';
import { Campground }  from './models/campground.js';
import mongoose from "mongoose";
import  methodOverride from "method-override";
import ejsMate from "ejs-mate";
import catchAsync from "./utils/catchAsync.js";
import expressError from "./utils/expressError.js";
import Joi from "joi";
import { campgroundScheme, reviewSchema } from "./schemasVerification.js";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import localPassport from 'passport-local';
import user from "./models/user.js";
import  Review from "./models/review.js"
import reviews from "./routes/reviews.js";
import campground from "./routes/campground.js";
import users from "./routes/users.js";
import CONSTANTS from "./config/contants.js";
const { mongoProdUri, secretCode } = CONSTANTS;

mongoose.connect(mongoProdUri)

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: secretCode,
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

app.use(passport.initialize())
app.use(passport.session());
passport.use(new localPassport(user.authenticate()))

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})



app.use("/", users)
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
    console.log(err)
    res.status(statusCode).render("error", {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})