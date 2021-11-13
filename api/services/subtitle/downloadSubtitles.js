const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const UserAgent = require('user-agents');
const download = require('download');
const decompress = require('decompress');
const fs = require('fs');
const srt2vtt = require('srt-to-vtt');
const path = require('path');
const appDir = path.dirname(require.main.filename);

async function get_download(url) {
  return new Promise(async (resolve) => {
    const userAgent = new UserAgent();
    const options = {
      headers: { 'User-Agent': userAgent },
    };
    const response = await fetch(url, options);
    const body = await response.text();
    const doc = new dom({
      locator: {},
      errorHandler: {
        warning: function (w) {},
        error: function (e) {},
        fatalError: function (e) {
          console.error(e);
        },
      },
    }).parseFromString(body);

    const regex = /(?<=href=")(.*?)(?=")/g;
    const found = body.match(regex);

    const result = found.filter((element) =>
      element.includes('/subtitleserve')
    );
    if (result.length > 0) {
      resolve('https://www.opensubtitles.org' + result[0]);
    }
  });
}

async function get_final_link(url) {
  const userAgent = new UserAgent();
  const options = {
    headers: { 'User-Agent': userAgent },
  };
  const response = await fetch(url, options);
  const body = await response.text();
  const doc = new dom({
    locator: {},
    errorHandler: {
      warning: function (w) {},
      error: function (e) {},
      fatalError: function (e) {
        console.error(e);
      },
    },
  }).parseFromString(body);

  const regex = /(?<=href=")(.*?)(?=")/g;
  const found = body.match(regex);

  const result = found.filter((element) => element.includes('/subtitles'));

  try {
    const res = await get_download(
      'https://www.opensubtitles.org/' + result[0]
    );
    return res;
  } catch (err) {
    console.log(err);
  }
}

async function downloadSubtitles(id, extension, name) {
  return new Promise(async (resolve) => {
    try {
      const modifiedId = id.substring(2);
      let url = '';
      if (extension === 'fr') {
        url =
          'https://www.opensubtitles.org/fr/search/sublanguageid-fre/imdbid-' +
          modifiedId;
      } else if (extension === 'en') {
        url =
          'https://www.opensubtitles.org/fr/search/sublanguageid-eng/imdbid-' +
          modifiedId;
      } else if (extension === 'es') {
        url =
          'https://www.opensubtitles.org/fr/search/sublanguageid-spa/imdbid-' +
          modifiedId;
      }

      const link = await get_final_link(url);
      fs.writeFileSync(
        appDir + '/tmp/subtitles/here.zip',
        await download(link)
      );
      await decompress(
        appDir + '/tmp/subtitles/here.zip',
        appDir + '/tmp/subtitles/download'
      );

      fs.readdirSync(appDir + '/tmp/subtitles/download').forEach((file) => {
        if (file.includes('.srt')) {
          fs.renameSync(
            appDir + '/tmp/subtitles/download/' + file,
            appDir + '/tmp/subtitles/tmp-srt.srt'
          );
        }
      });

      fs.rmSync(appDir + '/tmp/subtitles/here.zip');
      fs.rmdirSync(appDir + '/tmp/subtitles/download', { recursive: true });

      fs.createReadStream(appDir + '/tmp/subtitles/tmp-srt.srt')
        .pipe(srt2vtt())
        .pipe(fs.createWriteStream(appDir + '/tmp/subtitles/' + name + '.vtt'));

      fs.rmSync(appDir + '/tmp/subtitles/tmp-srt.srt');
      resolve(true);
    } catch (err) {
      resolve(false);
    }
  });
}

module.exports = downloadSubtitles;
