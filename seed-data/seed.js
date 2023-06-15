const helpers = require('./helpers')
const cityData = require('./cities')
const campground = require('../models/campground');
const mongoose = require('mongoose')
const { insertMany } = require('../models/campground');
const mbGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxGeo = mbGeoCoding({accessToken: 'pk.eyJ1IjoiYmVuamFtaW5wZXJzaXR6IiwiYSI6ImNsaW5mcHEzcTBtMWkzbHA4czlidzk4bXEifQ.2Pt6v31lIBmW_uBDaOKyBA'})

main().catch(err => console.log(err, 'Your connection failed'));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
    console.log('Connected')
}

const generateTitle = function (array) {
    return array[Math.floor(Math.random () * array.length)]
}

const getPhotos = async () => {
    let images = []
    const req = await fetch('https://api.unsplash.com/photos/random?client_id=JL_EAQ5PrK87ndYsUpDfiZqJ-uWexnh8lPvYWsPtNww&collections=483251&orientation=landscape&q=40&count=30')
    const data = await req.json()
    const reqtwo = await fetch('https://api.unsplash.com/photos/random?client_id=JL_EAQ5PrK87ndYsUpDfiZqJ-uWexnh8lPvYWsPtNww&collections=483251&orientation=landscape&q=40&count=30')
    const data2= await reqtwo.json()
    for(let img of data){
        images.push({url: img.urls.regular, filename: img.id})
    }
    for(let img of data2){
        images.push({url: img.urls.regular, filename: img.id})
    }
    console.log(images)
    return images
}


const startSeed = async () => {
   const images = await getPhotos()
    await campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const randomNumber1000 = Math.floor(Math.random() * 1000)
        let item = new campground ({
            title: `${generateTitle(helpers.descriptors)} ${generateTitle(helpers.places)}`,
            price: Math.floor(Math.random() * 40),
            location: `${cityData[randomNumber1000].city}, ${cityData[randomNumber1000].state}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi ipsum itaque non cupiditate iusto nulla, eaque voluptas, dolore perferendis laboriosam repudiandae necessitatibus modi autem quos doloribus. Quisquam iure repudiandae molestias? Repellendus perspiciatis in reiciendis perferendis aut excepturi consectetur quo provident. In, sequi dolore. Laboriosam ab sunt rem sequi laudantium quae magni, deleniti atque, velit, et minima illo quas dolorem quaerat?",
            images: images[i]
        })
        const mbReq = await mapBoxGeo.forwardGeocode({
            query: item.location,
            limit: 1,
            types: ['place']
        }).send()
        const coordinates = mbReq.body.features[0].geometry
        item.geometry = coordinates
        try {
        const savedCamp = await item.save()
        console.log('Item Saved')
        } catch (e) {
            console.log('Something went wrong', e)
        }
    }
}
startSeed()
