const OS = require('opensubtitles-api')
const download = require('download')
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const getSubtitles = (id, extension) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pathName = appDir + '/tmp/subtitles/' + id + "-" + extension + ".vtt";
            if (fs.existsSync(pathName)) {
                resolve(pathName);
            }

            OpenSubtitles = new OS({
                useragent: 'TemporaryUserAgent',
                username: 'tche42Api',
                password: 'i3Tli#4Ru0',
                ssl: false
            })
            const result = await OpenSubtitles.search({ imdbid: id })
            if (result[extension]) {
                if(result[extension].vtt) {
                    fs.writeFileSync(pathName, await download(result[extension].vtt));
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

module.exports = getSubtitles;