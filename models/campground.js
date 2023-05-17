const { string } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review');



const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300,h_100,c_fit')
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);


CampgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete', async function (data) {
    if (data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }
})
//Again this is post hook of mongoose middleware so refer docs to see which middlewares are triggered for particular methods of deleting , etc.

module.exports = mongoose.model('Campground', CampgroundSchema)