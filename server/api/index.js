const express = require('express');
const router = express.Router();
const Models = require('../models/index');
const { User, Poll } = Models;

router.get('/test', test);
router.post('/users/register', asyncWrap(register));
router.post('/users/login', asyncWrap(login));
router.get('/users/me', asyncWrap(auth), asyncWrap(me));
router.get('/polls', asyncWrap(pollsIndex));
router.post('/polls', asyncWrap(auth), asyncWrap(pollsCreate));
router.use((req, res, next) => {
  next(new Error('Not Found'));
});
router.use((err, req, res, _next) => {
  let status = 500;
  if (!(err instanceof Error)) {
    err = new Error(err);
  }
  if (err.message === 'Not Found') {
    status = 404;
  }

  res.status(status).json({
    error: {
      message: err.message,
    },
  });
});


function asyncWrap(fn) {
  if (arguments.length <= 3) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
      // fn(req, res, next).catch(next);
    };
  }
  return (err, req, res, next) => {
    Promise.resolve(fn(err, req, res, next)).catch(next);
  };
}

async function auth(req, res, next) {
  let token;
  if (req.headers.authorization) {
    const { authorization } = req.headers;
    [, token] = authorization.split(' ');
  } else if (req.cookies['auth._token.local']) {
    const cookieAuth = req.cookies['auth._token.local'];
    [, token] = cookieAuth.split(' ');
  } else {
    token = req.query.token || req.body.token;
  }
  if (!token) return next(new Error('Missing token', 401));
  const user = await User.findOne({ where: { refreshToken: token } });
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Invalid token', 401));
  }
};

async function test(req, res, next) {
  const user = await User.register('test', 'test');
  res.send('test');
}

async function register(req, res, next) {
  const { username, password } = req.body;
  const user = await User.register(username, password);
  if (!user) {
    return res.json({ error: 'Error registering' });
  }
  res.json({
    user: {
      refreshToken: user.refreshToken,
      username: user.username,
    },
  });
}

async function login(req, res, next) {
  const { username, password } = req.body;
  let user = await User.login(username, password);
  if (!user) {
    return res.json({ error: 'Error Logging In' });
  }
  user.lastLoginAt = new Date();
  user = await user.save();
  res.json({
    user: {
      refreshToken: user.refreshToken,
      username: user.username,
    },
  });
}

async function me(req, res, next) {
  const user = req.user;
  res.json({
    user: {
      refreshToken: user.refreshToken,
      username: user.username,
      id: user.id,
    },
  });
}

async function pollsIndex(req, res, next) {
  const polls = await Poll.findAll();
  res.json({ polls });
}

async function pollsCreate(req, res, next) {
  let { title, category, visibility, options, adding, autoclose } = req.body;
  let addingBy = adding ? req.body.addingBy : null;
  let closeAt = autoclose ? Date.parse(req.body.closeDateTime) : null;
  if (options) {
    options = options.reduce((accumulator, current) => {
      accumulator.push({ option: current, votes: 0, voters: [] });
      return accumulator;
    }, []);
  } else {
    options = {};
  }
  const poll = await Poll.create({
    title,
    category,
    visibility,
    addingBy,
    closeAt,
    options,
    votes: 0,
    UserId: req.user.id,
  });
  res.json({
    poll
  });
}

module.exports = router;
