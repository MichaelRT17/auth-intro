require('dotenv').config();
const express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0');

const app = express();
const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL
} = process.env;
console.log(CLIENT_ID, CLIENT_SECRET)

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session());
// console.log(process.env)
passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, (accessToken, refreshToken, extraParams, profile, done) => {
    console.log(profile)
    done(null, profile);
}))

passport.serializeUser((profile, done) => {
    done(null, profile);
})
passport.deserializeUser((profile, done) => {
    done(null, profile);
})

app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/'
}))

app.get('/getinfo', function(req, res) {
    res.status(200).send(req.user)
})


app.listen(SERVER_PORT, () => {
    console.log(`yo yo yo from port: ${SERVER_PORT}`);
})