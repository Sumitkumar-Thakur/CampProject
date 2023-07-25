import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { isLoggedIn , isAuthor, validateCampground} from "../middleware.js";
import review from "../models/review.js";
import multer from "multer";
import campgrounds from "../controllers/campgrounds.js";
import {storage} from '../cloudinary/index.js'
const upload = multer({storage});
const router = Router();

router.route('/')
    .get( catchAsync(campgrounds.index))
    .post( isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showCampground))
    .put( isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete( isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


export default router