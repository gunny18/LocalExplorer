const express = require('express');
router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
// const router = require('./reviews');
const { storage } = require('../cloudinary')
const multer = require('multer');
const upload = multer({ storage })





//routes simplifies using controllers

router.get('/', catchAsync(campgrounds.index));


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createNewCampground))

// router.post('/', upload.array('image'), (req, res) => {
//     console.log(req.body, req.files)
//     res.send('It worked!')
// })


router.get('/:id', catchAsync(campgrounds.showCampgrounds));

router.post('/search', catchAsync(campgrounds.searchCampground))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground))


module.exports = router




// router.get('/', (req, res) => {
//     res.render('home')
// });

// app.get('/makecampground', async (req,res)=>{
//     const camp = new Campground({title:'My Backyard', description:'Cheap Camping'})
//     await camp.save()
//     res.send(camp)
// });







// router.get('/new', isLoggedIn, (req, res) => {
//     // if (!req.isAuthenticated()) {
//     //     req.flash('error', 'You must be signed in')
//     //     return res.redirect('/login')
//     // }
//     res.render('campgrounds/new')
// });
//We are putting this route before the :id route coz other wise it will look for a page with id=new which does not exist.
//This was done even in previous applications just for this very reason
//let us protect the /new route
//we can protect it such that if a user is not logged in he cannot access this route
//passport adds a method called isAuthenticated() to the request object itself
//passport stores all these in its own sessions
//this noewprotects only this route
//so we can write a middleware for protecting any routes




// router.post('/', validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
//     // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 404)
//     //The above is to allow any user to get the post request through only if the request has a body
//     //But we can go around it using postman
//     //To avoid that we validate using joi, using callback....
//     const campground = await new Campground(req.body.campground)
//     campground.author = req.user._id
//     await campground.save();
//     req.flash('success', 'Successfully made a new campground');
//     res.redirect(`/campgrounds/${campground._id}`)
// }))


// router.get('/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id).populate({
//         path: 'reviews',
//         populate: {
//             path:'author'
//         }//To populate author of single review
//     }).populate('author');
//     if (!campground) {
//         req.flash('error', 'Campground not found :(');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/show', { campground });
// }));

// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params
//     const campground = await Campground.findById(id)
//     if (!campground) {
//         req.flash('error', 'Campground not found :(');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit', { campground });

// }))

// router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
//     req.flash('success', 'Successfully updated campground');
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
//     await Campground.findByIdAndDelete(req.params.id);
//     req.flash('success', 'Successfully deleted campground');
//     res.redirect('/campgrounds')
// }))

// module.exports = router;