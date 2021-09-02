function getExtension(path) {
    return new Promise((resolve, reject) => {
    const result = path.split('-');
    const [id, extension] = result;
    resolve([id, extension])
    })
}

module.exports = getExtension;