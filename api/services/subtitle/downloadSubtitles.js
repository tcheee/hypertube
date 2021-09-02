const OS = require('opensubtitles-api')
const download = require('download')
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const downdloadSubtitles = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            OpenSubtitles = new OS({
                useragent: 'TemporaryUserAgent',
                username: 'tche42Api',
                password: 'i3Tli#4Ru0',
                ssl: false
            })
            const result = await OpenSubtitles.search({ imdbid: id })
            console.log(result)
            if (result.en) {
                if(result.en.vtt) {
                    const pathName = appDir + '/tmp/subtitles/' + id + ".vtt"
                    fs.writeFileSync(pathName, await download(result.en.vtt));
                    resolve(pathName)
                }
            }
        } catch (err) {
            console.log('problem while downloading')
            console.log(err)
            reject(err)
        }
    })
}

module.exports = downdloadSubtitles;