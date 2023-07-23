import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../middleware.js";
import users from "../controllers/users.js";
const router = Router();

router.route('/register')
    .get( users.renderRegister)
    .post( catchAsync(users.register))

router.route('/login')
    .get( users.renderLogin)
    .post( storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(users.login))

router.get('/logout', users.logout)

export default router;