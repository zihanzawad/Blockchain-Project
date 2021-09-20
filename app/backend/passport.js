const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID:"1083300830187-m1i57dv37pd7ed2mskb6aaku3ffas25v.apps.googleusercontent.com",
        clientSecret:"ioQCpH3AMF6kY8Egg36H7Zfq",
        callbackURL: "/google/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }
));