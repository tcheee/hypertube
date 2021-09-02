const path = require('path');

function checkConversion(fileName) {
    const ext = path.extname(fileName)
    if (ext === '.mp4' || ext === '.webm' || ext === 'opgg') {
      return 'ok';
    }
    else if (ext === '.mkv') {
      return 'transcode'
    }
    else {
      return false
    }
  }

module.exports = checkConversion;