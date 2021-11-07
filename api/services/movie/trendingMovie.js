const axios = require('axios');
const getValidImage = require('./downloadImage');
const isWatchedMovie = require('./isWatchedMovie');

const getTrendingMovie = (genre, page, uuid) => {
  return new Promise(async (resolve, reject) => {
    const result = await axios
      .get(
        `https://yts.megaproxy.biz/api/v2/list_movies.json?page=${page}&sort_by=download_count&limit=48&genre=${genre}`
      )
      .then(async (result) => {
        console.log(result);
        const data = result.data.data.movies;
        const pages = Math.floor(result.data.data.movie_count / 48) + 1;
        const modifiedData = await Promise.all(
          data.map(async (movie) => {
            movie.image = await getValidImage(movie.imdb_code);
            movie.watched = await isWatchedMovie(uuid, movie.imdb_code);
            return movie;
          })
        );
        resolve({ count: pages, movies: modifiedData });
      })
      .catch((err) => {
        console.log(err);
        resolve({});
        return {};
      });
  });
};

module.exports = getTrendingMovie;
