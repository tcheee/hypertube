const axios = require('axios')
const getValidImage = require('./downloadImage');

const getTrendingMovie = () => {
    return new Promise(async (resolve, reject) => {
        const result = await axios.get('https://yts.megaproxy.info/api/v2/list_movies.json?page=1&sort_by=download_count&limit=21')
        .then(async (result) => {
            const data = result.data.data.movies;
            const modifiedData = await Promise.all(data.map(async (movie) => {
                movie.image =  await getValidImage(movie.imdb_code)
                return movie;
            }));
            resolve(modifiedData);
        }).catch(err => {
            console.log(err)
            resolve({})
            return({})
        })
        })
}

module.exports = getTrendingMovie;