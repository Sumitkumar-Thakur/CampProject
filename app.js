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
import Review from "./models/review.js"
import reviews from "./routes/reviews.js";
import campground from "./routes/campground.js";
import MongoStore from 'connect-mongo';
import users from "./routes/users.js";
import CONSTANTS from "./config/contants.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet  from "helmet";
const { mongoProdUri, secretCode, cloudinaryEnv } = CONSTANTS;

const MongoURI = mongoProdUri || 'mongodb://0.0.0.0:27017/yelp-camp'

mongoose.connect(MongoURI)

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

const store = MongoStore.create({
    mongoUrl: mongoProdUri,
    touchAfter: 24 * 60 * 60, //in seconds
    crypto: {
        secret: secretCode,
    }
});

store.on("error", function (e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store: store,
    name: 'session',
    secret: secretCode,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

app.use(flash());

app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dv5vm4sqh/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${cloudinaryEnv.cloudName}/`,
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dv5vm4sqh/" ],
            childSrc   : [ "blob:" ]
        }
    })
);

app.use(passport.initialize())
app.use(ExpressMongoSanitize({
    replaceWith: '_'
}))
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Serving on port 3000')
})