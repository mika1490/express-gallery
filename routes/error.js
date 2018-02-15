const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => {
    return res.render('./views/partials/error/404');
  });

module.exports = router;