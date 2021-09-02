const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const findRange = require('./findRange')

const fileStreaming = (hash, range) => {
  if (appDir + "/tmp/" + hash + ".mp4") {
    const fileInfo = promisify(fs.stat)
    const moviePath = appDir + "/tmp/movies/" + hash + ".mp4";
    const {size} = await fileInfo(moviePath)
    const [start, end] = findRange(range, size)
    const readable = fs.createReadStream(moviePath, {start, end} )
    // return (readable);
    res.writeHead(206, {
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-store',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': parseInt(end - start) + 1,
      'Content-Type': 'video/mp4'
    })
    readable.pipe(res)
  }
}

module.exports = fileStreaming;