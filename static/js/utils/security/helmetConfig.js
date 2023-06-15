const allowedFontSources = ["'self'", "https://fonts.google.com/", "https://*.fontawesome.com"]
const allowedImageSources = ["'self'", "https://res.cloudinary.com/", "data:", "blob:", "https://images.unsplash.com"]
const allowedScriptSources = ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://api.mapbox.com", "*.fontawesome.com"]
const allowedConnectSources = ["'self'", "https://api.mapbox.com", "https://a.tiles.mapbox.com", "https://b.tiles.mapbox.com", "https://events.mapbox.com", "*.fontawesome.com"]
const allowedWorkerSources =  ["'self'", "blob:"]
const allowedStyles = ["'self'", "'unsafe-inline'", "https://*fontawesome.com", ]

module.exports = {allowedConnectSources, allowedFontSources, allowedImageSources, allowedScriptSources, allowedWorkerSources, allowedStyles}