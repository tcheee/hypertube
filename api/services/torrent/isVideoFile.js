const path = require('path');

function isVideoFile(fileName) {
    const ext = path.extname(fileName)
    if (ext === '.mp4' || ext === '.webm' || ext === 'opgg' || ext === '.mkv') {
      return true
    }
    else {
      return false
    }
  }

module.exports = isVideoFile;