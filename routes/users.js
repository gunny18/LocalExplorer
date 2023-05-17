const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')
const passport = require('passport')
const users = require('../controllers/users')


//routes using controller

router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.loginUser))

router.get('/logout', users.logoutUser)


module.exports = router













// router.get('/register', (req, res) => {
//     res.render('users/register')
// })

//the way we have set this is that when a user registers he again has to login manually
//passport provides a way around that
//we use the req.login() provided by passport
//this is prmarily used after a user has been registered
//login() takes the registered user as first param and a callback that deals if any error is found

// router.post('/register', catchAsync(async (req, res) => {
//     try {
//         const { email, username, password } = req.body
//         const user = new User({ email, username })
//         const registeredUser = await User.register(user, password)
//         req.login(registeredUser, err => {
//             if (err) return next()
//             req.flash('success', 'Welcome to yelp-camp')
//             res.redirect('/campgrounds')
//         })

//     } catch (e) {
//         req.flash('error', e.message)
//         res.redirect('/register')
//     }
// }))
//But with catchAsync it will just handle the error with the generic template we defined
// we can write our own try catch block to handle it differently

// router.get('/login', (req, res) => {
//     res.render('users/login')
// })

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
//     req.flash('success', 'Welcome Back')
//     const redirectUrl = req.session.returnTo || '/campgrounds'
//     delete req.session.returnTo
//     res.redirect(`${redirectUrl}`)

// }))
//passport.authenticate() is a middleware given to us by passport to authenticate a user
//we need to specify the strategy i.e since we are hosting in local host we give a local strategy
//we set other options like flash if failure and redirect if failure as shown
//If after all this it hits the route we know that the user has been authenticated
//we see that all this happens in the background and we get the final scene if or not the user is authenticated

// router.get('/logout', (req, res) => {
//     req.logout()
//     req.flash('success', 'Succesfully logged out')
//     res.redirect('/campgrounds')
// })
//with passport this is the way to logout





// module.exports = router