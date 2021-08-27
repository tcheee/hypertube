const express = require('express');
const md5 = require('md5');
const fs = require('fs');
const router = express.Router();
const TorrentSearchApi = require('torrent-search-api');
const torrentStream = require('torrent-stream');
let path;

router.get('/', (req, res) => {
  res.json({msg: "all good, working as expected"});
});

router.post("/api/search", async (req, res) => {
  console.log(req.body);
  let search = req.body.query
  TorrentSearchApi.enableProvider('ThePirateBay')
  const torrents = await TorrentSearchApi.search(search, 'Video', 25);
  //let result = await updateTorrents(torrents)
  console.log("after")
  res.json(torrents)
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
  const magnet = match[0]
  const { range } = req.headers
  const streaming_engine = torrentStream(magnet);
  const download_engine = torrentStream(magnet)
  launchDownload(download_engine)

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

module.exports = router;