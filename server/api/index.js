const express = require('express');
const router = express.Router();
const Models = require('../models/index');
const { User } = Models;

router.get('/test', test);

async function test(req, res, next) {
  const user = await User.register('test', 'test');
  res.send('test');
}

module.exports = router;
