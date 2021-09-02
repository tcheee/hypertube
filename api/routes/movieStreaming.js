const express = require('express');
const fs = require('fs');
const router = express.Router();
const torrentStream = require('torrent-stream');
const {promisify} = require('util');
const ffmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream');
const checkConversion = require('../services/torrent/checkConversion');
const isVideoFile = require('../services/torrent/isVideoFile');

function launchStreaming(engine, file, range, res) {
    const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
    const start = (parts) ? parseInt(parts[0], 10) : 0
    const end = (parts && parts[1]) ? parseInt(parts[1], 10) : file.length - 1
    const videoFileType = checkConversion(file.name)

    if (!videoFileType) {
      console.log(file.name)
      console.log(videoFileType)
      res.json({err: "uknown format for the available file"})
      return ; 
    }

    let stream;
    if (videoFileType === 'ok') { 
      stream = file.createReadStream({ start, end })
    }
    else {
      try {
        stream = new ffmpeg(file.createReadStream({start, end})).format('mp4')
      } catch (err) {
        res.json({err: "uknown format for the available file"})
      }
    }
    //const pipeStream = new PassThrough();
    // const pipeDownload = new PassThrough();

    // stream.pipe(pipeStream)
    // stream.pipe(pipeDownload)

    res.on('close', () => {
        engine.remove(true, () => { console.log('Engine cleared') } )
        engine.destroy()
    })
    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Content-Length': parseInt(end - start) + 1,
        'Content-Type': 'video/mp4'
    })

    // const write = fs.createWriteStream(__dirname + "/../tmp/" + file.name, {
    //   flags: 'a',
    //   start: start,
    // })
    // pipeDownload.pipe(write)
    stream.pipe(res)
}

function launchDownload(download_engine, range, res) {
  download_engine.on('ready', function() {
    download_engine.files.forEach(async function(file) {
      if (isVideoFile(file.name) === 'ok') {
        const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
        const start = (parts) ? parseInt(parts[0], 10) : 0
        const end = (parts && parts[1]) ? parseInt(parts[1], 10) : file.length - 1
        const stream = file.createReadStream()
        const write = fs.createWriteStream(__dirname + "/../tmp/" + file.name)
        stream.pipe(write)

        const streamMovie = await createStream(file);
        res.writeHead(206, {
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache, no-store',
          'Content-Range': `bytes ${start}-${end}/${file.length}`,
          'Content-Length': parseInt(end - start) + 1,
          'Content-Type': 'video/mp4'
        })
        if (streamMovie) {
          streamMovie.pipe(res);
         }
      }
      else {
        res.json({error: "unknown type of torrent"})

      }
    });
  });

  download_engine.on ('torrent', () => {
    console.log('event metadata are fetched!')
  })
  
  download_engine.on('download', (index) => {
    console.log(download_engine.swarm.downloaded + " was downloaded! Piece number: " + index)
  })

  download_engine.on('idle', () => {
    console.log("download is finished!")
  })
}

function findRange(range, size) {
  const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
  const start = (parts) ? parseInt(parts[0], 10) : 0
  const end = (parts && parts[1]) ? parseInt(parts[1], 10) : size - 1
  return ([start, end])
}

router.get("/api/stream/*", async (req, res) => {
  const full_url = req.protocol + '://' + req.get('host') + req.originalUrl
  const match = full_url.match(/(?<=stream\/)(.*)/g)
  const hash = match[0]
  const { range } = req.headers
  const streaming_engine = torrentStream(hash);
  // const download_engine = torrentStream(hash)
  // const fileInfo = promisify(fs.stat)

  // if (__dirname + "/../tmp/" + hash + ".mp4") {
  //   const {size} = await fileInfo(__dirname + "/../tmp/" + hash + ".mp4")
  //   const [start, end] = findRange(range, size)
  //   const readable = fs.createReadStream(__dirname + "/../tmp/" + hash + ".mp4", {start, end} )
  //   res.writeHead(206, {
  //     'Accept-Ranges': 'bytes',
  //     'Cache-Control': 'no-cache, no-store',
  //     'Content-Range': `bytes ${start}-${end}/${size}`,
  //     'Content-Length': parseInt(end - start) + 1,
  //     'Content-Type': 'video/mp4'
  //   })
  //   readable.pipe(res)
  // }
  // else { 
  //   launchDownload(download_engine, range, res)
  // }

  streaming_engine.on('ready', function() {
    streaming_engine.files.forEach(function(file) {
      if (isVideoFile(file.name)) { 
        launchStreaming(streaming_engine, file, range, res)
      }
    });
  });

  streaming_engine.on ('torrent', () => {
    console.log('event metadata are fetched!')
  })
  
  streaming_engine.on('download', (index) => {
    console.log(streaming_engine.swarm.downloaded + " was downloaded for streaming! Piece number: " + index)
  })
})

module.exports = router