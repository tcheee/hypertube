function findRange(range, size) {
    const parts = (range) ? range.replace(/bytes=/, '').split('-') : null
    const start = (parts) ? parseInt(parts[0], 10) : 0
    const end = (parts && parts[1]) ? parseInt(parts[1], 10) : size - 1
    return ([start, end])
  }

module.exports = findRange;