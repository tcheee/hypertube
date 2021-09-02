const ffmpeg = require('fluent-ffmpeg')

async function converStream(file, start, end) {
    return new Promise((resolve) => {
      try {
        const stream = ffmpeg()
        .input(file.createReadStream({start, end}))
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .outputFormat('mp4')
        .on('error', ignored => {})
        .audioCodec('aac')
        .videoCodec('libx264')
        return (stream)
      } catch (err) {
        resolve({ err })
      }
    })
}

module.exports = converStream;