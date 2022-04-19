const express = require('express')
const router = express.Router()

//Landing Page -- GET '/'
router.get('/', (req, res) => {res.render('Youglish', {layout: 'main'})})

module.exports = router