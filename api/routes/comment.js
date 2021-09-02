var express = require('express')
var router = express.Router()
      
router.get('/comment', (req, res) => {
    res.json({msg: "all good, working as expected"});
  });

module.exports = router