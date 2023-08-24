const cloudinary = require('cloudinary').v2
const  {CloudinaryStorage} = require('multer-storage-cloudinary')
console.log(process.env.cloudinaryCloudName)
console.log(process.env.cloudinaryAPIKey)
console.log(process.env.cloudinarySecret)
console.log(typeof(process.env.cloudinaryAPIKey))
cloudinary.config({
    cloud_name: process.env.cloudinaryCloudName,
    api_key: process.env.cApiKey,
    api_secret: process.env.cloudinarySecret
})
console.log(cloudinary.cloudinary_js_config())
console.log(cloudinary.config())
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: 'YelpCamp',
    allowedFormats: ['jpeg', 'jpg', 'png'],
    // public_id: async (req, file) => file.originalname,
    use_filename: true,
    filename_override: async (req, file) => file.originalname
    }
})

module.exports = {
    cloudinary, storage
}
