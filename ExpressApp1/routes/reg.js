'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('this is reg page');
});

router.post('/', function (req, res) {
    res.send('respond with a resource');
});

module.exports = router;
