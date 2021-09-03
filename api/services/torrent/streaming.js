const express = require('express');
const fs = require('fs');
const torrentStream = require('torrent-stream');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const { PassThrough } = require('stream');
const checkConversion = require('./checkConversion');
const isVideoFile = require('./isVideoFile');


async function downdloadMovie(pipeDownload, file) {
    console.log('written')
    const write = fs.createWriteStream(appDir + "/tmp/movies/" + file.name)
    pipeDownload.pipe(write)
}

async function launchStreaming(engine, file, range, res) {
    const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
    const start = (parts) ? parseInt(parts[0], 10) : 0
    const end = (parts && parts[1]) ? parseInt(parts[1], 10) : file.length - 1
    const videoFileType = checkConversion(file.name)

    console.log(file)

    if (!videoFileType) {
      console.log(file.name)
      console.log(videoFileType)
      res.json({err: "uknown format for the available file"})
      return ; 
    }

    let pipeStream;
    let pipeDownload;
    if (videoFileType === 'ok') { 
        pipeStream = file.createReadStream({ start, end });
        pipeDownload = file.createReadStream();

        pipeDownload.on('end', () => {
            console.log('file downloaded')
        })
    }
    else {
        pipeStream = await converStream(file, start, end);
    }

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Content-Length': parseInt(end - start) + 1,
        'Content-Type': 'video/mp4'
    })

    console.log('here')
    downdloadMovie(pipeDownload, file, start);

    pipeStream.pipe(res)
}

async function handleStreaming(req, res) {
  const full_url = req.protocol + '://' + req.get('host') + req.originalUrl
  const match = full_url.match(/(?<=stream\/)(.*)/g)
  const hash = match[0]
  //const hash = "magnet:?xt=urn:btih:02826CD17832EFE0E620FE87B673BFEA2BB6B314&dn=A.Glitch.in.the.Matrix.2021.1080p.WEB-DL.DD5.1.H264-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2910%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2980%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce"
  const { range } = req.headers
  const streaming_engine = torrentStream(hash);
  let numPieces;
  let pieces = []
  console.log('new request is done HERE !!!!!!')

  //Check in DB and FS it the movie is ready to stream directly from the FS without checking bittorent

  streaming_engine.on('ready', function() {
    streaming_engine.files.forEach(function(file) {
      if (isVideoFile(file.name)) { 
        launchStreaming(streaming_engine, file, range, res)
      }
    });
  });

  streaming_engine.on ('torrent', ({ pieces }) => {
    console.log('event metadata are fetched!')
    if (!numPieces) {
        numPieces = pieces.length;
    } 
  })
  
  streaming_engine.on('download', (index) => {
    console.log(streaming_engine.swarm.downloaded + " was downloaded for streaming for " + hash + " ! Piece number: " + index)
    pieces.push(index);
    console.log("Completed : " + (parseInt(pieces.length) / parseInt(numPieces, 10) * 100 + "%"))
  })

  streaming_engine.on('idle', () => {
    console.log('Movie download, I will disappear!')
    console.log("Completed : " + (parseInt(pieces.length, 10) / parseInt(numPieces, 10) * 100 + "%"));
    // when near to 100%, store in db that the movie was downloaded with: idmb + resolution 

    streaming_engine.remove(true, () => { console.log('Engine cleared') } )
    streaming_engine.destroy()
  })
}

module.exports = handleStreaming;