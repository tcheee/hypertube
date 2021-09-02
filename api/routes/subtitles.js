var express = require('express')
var router = express.Router()
const fs = require('fs');
const downdloadSubtitles = require('../services/subtitle/downloadSubtitles')

router.get("/api/subtitles/:id", async (req, res) => {
    console.log('lets download subtitles')
    const pathName = await downdloadSubtitles(req.params.id)
    res.setHeader('Content-Type', 'text/vtt')
    res.send(fs.readFileSync(pathName).toString())
  })
  
  module.exports = router;