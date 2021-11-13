var express = require('express');
var router = express.Router();
const fs = require('fs');
const getSubtitles = require('../services/subtitle/getSubtitles');
const getExtension = require('../services/subtitle/getExtension');

router.get('/api/subtitles/:id', async (req, res) => {
  const [id, extension] = await getExtension(req.params.id);
  const pathName = await getSubtitles(id, extension);
  res.setHeader('Content-Type', 'text/vtt');
  res.send(fs.readFileSync(pathName).toString());
});

module.exports = router;
