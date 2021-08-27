const tnp = require('torrent-name-parser');
const axios = require('axios')

async function updateTorrents(torrents) {
    torrents.map(async (torrent) => {
        torrent.title = tnp(torrent.title).title
        const tmdb = await axios.get('https://api.themoviedb.org/3/search/movie?api_key=8c8849bc683fcdb15ef6e2840a395184&query=' + torrent.title.replaceAll(' ', '-'));
        if (tmdb.data.results[0]) {
          console.log(tmdb.data.results[0])
          torrent.synopsis = tmdb.data.results[0].overview
          torrent.image = "https://image.tmdb.org/t/p/w500" + tmdb.data.results[0].poster_path
        }
    })
    return (torrents)
  }