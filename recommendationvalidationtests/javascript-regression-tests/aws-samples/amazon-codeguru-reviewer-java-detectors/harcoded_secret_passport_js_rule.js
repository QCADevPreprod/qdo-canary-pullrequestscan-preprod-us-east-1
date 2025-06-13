//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

// {fact rule=harcoded_secret_passport_js_rule@v1.0 defects=1}
function new_noncompliant()
{
    const passport = require('passport');
    const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');

    const User = require('../models/User');
    const {JWT_SECRET} = "scretKey";

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
}
// {/fact}

// {fact rule=harcoded_secret_passport_js_rule@v1.0 defects=0}
function new_compliant()
{
    const passport = require('passport');
    const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');

    const User = require('../models/User');
    const {JWT_SECRET} = process.env;

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
}
// {/fact}

