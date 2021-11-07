var express = require('express');
var router = express.Router();
const getTrendingMovie = require('../services/movie/trendingMovie');
const getMovieSearch = require('../services/movie/movieSearch');

router.get('/api/movie/trending', async (req, res) => {
  console.log('uuid is : ' + req.query.uuid);
  const result = await getTrendingMovie(
    req.query.category,
    req.query.page,
    req.query.uuid
  );
  res.json(result);
});

router.post('/api/movie/search', async (req, res) => {
  const result = await getMovieSearch(req.body.query, req.query.uuid);
  res.json(result);
});

router.post('/api/movie/:id', async (req, res) => {
  const result = await getMovieSearch(req.body.query, req.query.uuid);
  res.json(result);
});

module.exports = router;
