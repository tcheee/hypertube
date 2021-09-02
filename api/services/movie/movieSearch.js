const axios = require('axios')
const getValidImage = require('./downloadImage');

function movieSearch(search) {
    return new Promise(async (resolve, reject) => {
        const encoded = encodeURI(search);
        axios.get('https://yts.megaproxy.info/api/v2/list_movies.json?page=1&query_term=' + encoded)
        .then(async (result) => {
        if (result.data.data) {
            const data = result.data.data.movies;
            const modifiedData = await Promise.all(data.map(async (movie) => {
                movie.image =  await getValidImage(movie.imdb_code)
                return movie;
            }));
            resolve(modifiedData)
        }
        else {
            resolve({msg: 'we did not find anything'})
        }
        })
        .catch(function(err) {
            console.log(err)
            reject({msg: 'error while fetching data'})
        })
    })
}

module.exports = movieSearch;