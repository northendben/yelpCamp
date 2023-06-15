const mbGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geoCodingService = mbGeoCoding({accessToken: process.env.mapBoxToken})
module.exports = geoCodingService