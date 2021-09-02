const axios = require('axios')
var express = require('express')
var router = express.Router()
const getTrendingMovie = require('../services/movie/trendingMovie')
const getMovieSearch = require('../services/movie/movieSearch')
  
router.get("/api/home", async (req, res) => {
    const result = await getTrendingMovie();
    res.json(result)
    });

router.post("/api/search", async (req, res) => {
    const result = await getMovieSearch(req.body.query);
    res.json(result)
})
      

module.exports = router