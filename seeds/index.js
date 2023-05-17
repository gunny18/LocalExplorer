const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers')


const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error :("))
db.once("open", () => {
    console.log("Database Connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    //     const c = new Campground({title: 'purple field'})
    //     await c.save()
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '62397fe020f8e672aa476b59',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente at libero est ipsam mollitia error laboriosam quos similique illum, sed autem numquam consectetur officiis sit, eius in, sunt quisquam aperiam!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dhdqnxlor/image/upload/v1648047272/Yelp%20Camp/zs0stlrmm0falyuzdvqn.avif',
                    filename: 'Yelp Camp/zs0stlrmm0falyuzdvqn',

                },
                {
                    url: 'https://res.cloudinary.com/dhdqnxlor/image/upload/v1648047274/Yelp%20Camp/xpsottbrg2nsridgyedp.avif',
                    filename: 'Yelp Camp/xpsottbrg2nsridgyedp',

                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})
//to close the mongoose connection after running the file