const express = require('express');
const md5 = require('md5');
const fs = require('fs');
const router = express.Router();
const TorrentSearchApi = require('torrent-search-api');
const torrentStream = require('torrent-stream');
const OS = require('opensubtitles-api')
const download = require('download')
const axios = require('axios')

router.get('/', (req, res) => {
  res.json({msg: "all good, working as expected"});
});

router.post("/api/search", async (req, res) => {
  console.log(req.body);
  let search = req.body.query
  const encoded = encodeURI(search);
  //TorrentSearchApi.enableProvider('ThePirateBay')
  axios.get('https://yts.megaproxy.info/api/v2/list_movies.json?page=1&query_term=' + encoded)
  .then(function(data) {
    if (data.data.data) {
      let result = data.data.data.movies
      res.json(result)
    }
    else {
      res.json({msg: 'we did not find anything'})
    }
  })
  .catch(function(err) {
      console.log(err)
      res.json({msg: 'error while fetching data'})
  })
  // const torrents = await TorrentSearchApi.search(search, 'Video', 25);
  // //let result = await updateTorrents(torrents)
  // res.json(torrents)
})

function isVideoFile(fileName) {
  const format = [ '.*[.]{1}mp4', '.*[.]{1}avi', '.*[.]{1}mkv' ] // To do: check that th extension is mp4 or avi by checking the last character
  return fileName.match(new RegExp('(' + format.join('|') + ')'))
}

function launchStreaming(engine, file, range, res) {
    const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
    const start = (parts) ? parseInt(parts[0], 10) : 0
    const end = (parts && parts[1]) ? parseInt(parts[1], 10) : file.length - 1

    const stream = file.createReadStream({ start, end })

    console.log('Streaming[Standard]: processing')
    res.on('close', () => {
        engine.remove(true, () => { console.log('Engine cleared') } )
        engine.destroy()
        console.log('Streaming[Standard]: closed')
    })
    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Content-Length': parseInt(end - start) + 1,
        'Content-Type': 'video/mp4'
    })
    stream.pipe(res)
}

function launchDownload(download_engine) {
  download_engine.on('ready', function() {
    download_engine.files.forEach(function(file) {
      if (isVideoFile(file.name)) {
        const stream = file.createReadStream()
        const write = fs.createWriteStream(file.name)
        stream.pipe(write)
      }
    });
  });

  download_engine.on ('torrent', () => {
    console.log('event metadata are fetched!')
  })
  
  download_engine.on('download', (index) => {
    console.log(download_engine.swarm.downloaded + "was downloaded! Piece number: " + index)
  })

  download_engine.on('idle', () => {
    console.log("download is finished!")
  })
}

router.get("/api/stream/*", async (req, res) => {
  let num;
  const full_url = req.protocol + '://' + req.get('host') + req.originalUrl
  const match = full_url.match(/(?<=stream\/)(.*)/g)
  const hash = match[0]
  const { range } = req.headers
  const streaming_engine = torrentStream(hash);
  //const download_engine = torrentStream(magnet)
  //launchDownload(download_engine)

  streaming_engine.on('ready', function() {
    streaming_engine.files.forEach(function(file) {
      console.log('filename:', file.name);
      num = parseInt(file.length);
      console.log(num)
      if (isVideoFile(file.name)) {
        launchStreaming(streaming_engine, file, range, res)
      }
    });
  });

  streaming_engine.on ('torrent', () => {
    console.log('event metadata are fetched!')
  })
  
  streaming_engine.on('download', (index) => {
    console.log(streaming_engine.swarm.downloaded + "was downloaded for streaming! Piece number: " + index)
  })
})

router.get("/api/subtitles/:id", async (req, res) => {
  console.log('lets download subtitles')
  let id = req.params.id
  OpenSubtitles = new OS({
    useragent: 'TemporaryUserAgent',
    username: 'tche42Api',
    password: 'i3Tli#4Ru0',
    ssl: false
  })
  const result = await OpenSubtitles.search({ imdbid: id })
  console.log(result)
  if (result.en) {
    if(result.en.vtt) {
      const pathName =__dirname + '/../tmp/' + id + ".vtt"
      fs.writeFileSync(pathName, await download(result.en.vtt));
      console.log(pathName)
      res.setHeader('Content-Type', 'text/vtt')
      res.send(pathName)
    }
  }
})

module.exports = router;