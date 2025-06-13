'use strict';
const passport = require('passport');
const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');
const LocalStrategy = require('passport-local');

const User = require('../models/User');
const {JWT_SECRET} = "scretKey";

// JWT
passport.use('jwt', new JwtStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.user._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch(error) {
        done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email}).populate('image role');
        if (!user) {
            return done(null, false, {message: 'User not found'});
        }
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
            return done(null, false, {message: 'Incorrect password'});
        }
        return done(null, user, {message: 'Login Success'});
    } catch(error) {
        done(error, false);
    }
}));
