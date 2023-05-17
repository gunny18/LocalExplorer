const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  // if (!req.isAuthenticated()) {
  //     req.flash('error', 'You must be signed in')
  //     return res.redirect('/login')
  // }
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = await new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  //gives longitude and then latitude
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  //each mapping returns an object with path and filename and stores in the campgrounds images array
  campground.author = req.user._id;
  await campground.save();
  // console.log(campground)
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampgrounds = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      }, //To populate author of single review
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found :(");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.searchCampground = async (req, res) => {
    if(req.body.search !==''){
          const { search } = req.body;
          const foundCampground = await Campground.findOne({ title: search });
          if(!foundCampground){
              req.flash('error','Campground not found, Enter a valid Title')
               return res.redirect('/campgrounds')
          }
          return res.redirect(`/campgrounds/${foundCampground._id}`);
    }else{
        res.redirect('/campgrounds')
    }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found :(");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  // console.log(req.body)
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { runValidators: true, new: true }
  );
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    // console.log(campground)
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
