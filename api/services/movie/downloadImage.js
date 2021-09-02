const axios = require('axios')

const getValidImage = async (imdb) => {
    return new Promise((resolve, reject )=> {
    axios.get('http://www.omdbapi.com/?i=' + imdb +'&apikey=b8dbd7da')
    .then((result) => {
      resolve (result.data.Poster)
    }).catch((err) => {
      console.log(err)
    })
    });
  }

  module.exports = getValidImage;