const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({msg: "all good no? as expected"});
});

module.exports = router;