const axios = require('axios')

async function search() {
    axios.get('https://yts.megaproxy.info/api/v2/list_movies.json?page=1&query_term=spider%20man')
    .then(function(data) {
        let result = data.data.data.movies
        result.map((movie) => {
            console.log(movie)
            console.log("here is: " + movie.title + " and id is: " + movie.imdb_code + " and quality is " + movie.quality)
            console.log(movie.torrents)
        })
    })
    .catch(function(err) {
        console.log(err)
    })
}

search()