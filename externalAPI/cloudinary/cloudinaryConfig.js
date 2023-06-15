const cloudinary = require('cloudinary').v2
const  {CloudinaryStorage} = require('multer-storage-cloudinary')
cloudinary.config({
    cloud_name: process.env.cloudinaryCloudName,
    api_key: process.env.CloudinaryAPIKey,
    api_secret: process.env.cloudinarySecret
})
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
