const OS = require('opensubtitles-api')

const OpenSubtitles = new OS({
    useragent: 'TemporaryUserAgent',
    username: 'tche42Api',
    password: 'i3Tli#4Ru0',
    ssl: false
})

async function getSubtitles() {
    const res = await OpenSubtitles.search({ imdbid: 'tt0413300' })
    console.log(res)
}

getSubtitles()

