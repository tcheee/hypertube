const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({msg: "all good, working as expected"});
});

module.exports = router;