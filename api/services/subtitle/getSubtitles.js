const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const downloadSubtitles = require('./downloadSubtitles');

const getSubtitles = (id, extension) => {
  return new Promise(async (resolve, reject) => {
    try {
      const name = id + '-' + extension;
      const pathName = appDir + '/tmp/subtitles/' + name + '.vtt';
      if (fs.existsSync(pathName)) {
        resolve(pathName);
      }

      const downloadResult = await downloadSubtitles(id, extension, name);
      downloadResult ? resolve(pathName) : '';
    } catch (err) {
      console.log('problem while downloading');
      console.log(err);
      console.log(err.data);
      reject(err);
    }
  });
};

module.exports = getSubtitles;
