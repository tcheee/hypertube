const express = require('express');
const router = express.Router();
const handleStreaming = require('../services/torrent/streaming');


router.get("/api/stream/*", (req, res) => {
    handleStreaming(req,res)
})

module.exports = router