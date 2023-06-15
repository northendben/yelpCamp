const express = require('express')
const router = express.Router()
const templateBuilder = require('../static/js/utils/errorTemplateLookup')
router.post('', async (req, res) => {
    let clientInfo = req.body
    const error = {
        status: clientInfo.status,
        message: clientInfo.message
    }
    res.render('errors/errors', {templateBuilder:templateBuilder, error: error, err: JSON.stringify(error)})
})

router.get('', async (req,res) => {
    res.render('errors/errors', {templateBuilder:templateBuilder})
})

module.exports = router