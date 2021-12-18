const express = require('express');
const fs = require('fs');
const torrentStream = require('torrent-stream');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const { PassThrough } = require('stream');
const checkConversion = require('./checkConversion');
const isVideoFile = require('./isVideoFile');
const setDownloadedMovie = require('../movie/setDownloadedMovie');
const isDownloadMovie = require('../movie/isDownloadMovie');

async function downdloadMovie(pipeDownload, pathName) {
  const write = fs.createWriteStream(pathName);
  pipeDownload.pipe(write);
}

async function launchStreaming(engine, file, range, res, pathName) {
  const parts = range ? range.replace(/bytes=/, '').split('-') : null;
  const start = parts ? parseInt(parts[0], 10) : 0;
  const end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
  const videoFileType = checkConversion(file.name);

  console.log(file);

  if (!videoFileType) {
    console.log(file.name);
    console.log(videoFileType);
    res.json({ err: 'uknown format for the available file' });
    return;
  }

  let pipeStream;
  let pipeDownload;
  if (videoFileType === 'ok') {
    pipeStream = file.createReadStream({ start, end });
    pipeDownload = file.createReadStream();

    pipeDownload.on('end', () => {
      console.log('file downloaded');
    });
  } else {
    pipeStream = await converStream(file, start, end);
  }

  res.writeHead(206, {
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache, no-store',
    'Content-Range': `bytes ${start}-${end}/${file.length}`,
    'Content-Length': parseInt(end - start) + 1,
    'Content-Type': 'video/mp4',
  });

  downdloadMovie(pipeDownload, pathName);
  pipeStream.pipe(res);
}

async function launchStreamFS(file, range, res, fileSize) {
  try {
    const CHUNK_SIZE = 10 ** 6;
    const parts = range ? range.replace(/bytes=/, '').split('-') : null;
    const start = parts ? parseInt(parts[0], 10) : 0;
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    if (start > end) {
      res.writeHead(400);
      res.end('bad request');
    }

    const headers = {
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-store',
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': parseInt(end, 10) - parseInt(start, 10) + 1,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);
    const readStream = fs.createReadStream(file, { start, end });
    readStream.pipe(res);
  } catch (err) {
    res.writeHead(400);
    res.end('bad request');
  }
}

async function launchStreamTorrent(res, hash, range, pathName) {
  const streaming_engine = torrentStream(hash);
  let numPieces;
  let size = 0;
  let pieces = [];
  console.log('new request is done HERE !!!!!!');

  streaming_engine.on('ready', function () {
    streaming_engine.files.forEach(function (file) {
      if (isVideoFile(file.name)) {
        size = file.length;
        launchStreaming(streaming_engine, file, range, res, pathName);
      }
    });
  });

  streaming_engine.on('torrent', (data) => {
    console.log('event metadata are fetched!');
    console.log(data);
    console.log(size);
    if (!numPieces) {
      numPieces = pieces.length;
    }
  });

  streaming_engine.on('download', (index) => {
    console.log(size);
    pieces.push(index);
  });

  streaming_engine.on('idle', () => {
    console.log('Movie should be downloaded, I will disappear!');
    const stat = fs.statSync(pathName);
    const fileSize = stat.size;

    if (fileSize >= size) {
      setDownloadedMovie(hash);
    }
    streaming_engine.remove(true, () => {
      console.log('Engine cleared');
    });
    streaming_engine.destroy();
  });
}

async function handleStreaming(req, res) {
  const full_url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const match = full_url.match(/(?<=stream\/)(.*)/g);
  const hash = match[0];
  //const hash = "magnet:?xt=urn:btih:02826CD17832EFE0E620FE87B673BFEA2BB6B314&dn=A.Glitch.in.the.Matrix.2021.1080p.WEB-DL.DD5.1.H264-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2910%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2980%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce"
  const { range } = req.headers;
  const pathName = appDir + '/tmp/movies/' + hash + '.mp4';

  try {
    const stat = fs.statSync(pathName);
    const checkDownload = await isDownloadMovie(hash);
    if (checkDownload && stat.size > 0) {
      launchStreamFS(pathName, range, res, stat.size);
      return;
    } else {
      launchStreamTorrent(res, hash, range, pathName);
    }
  } catch (err) {
    //console.log(err);
    launchStreamTorrent(res, hash, range, pathName);
  }
}

module.exports = handleStreaming;
