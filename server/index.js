
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const SocketIO = require('socket.io');
const consola = require('consola')
const api = require('./api')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8000

app.set('port', port)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Database
  const models = require('./models/index');
  const force = process.env.DB_FORCE_SYNC === 'true';

  models.sequelize.sync({ force }).then(() => {
    console.log('Sequelize synced'); // eslint-disable-line
  });
  const { User, Poll } = models;

  // Api routes
  app.use('/api', api);

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server = app.listen(port, host);
  const io = SocketIO(server);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  io.on('connection', (socket) => {
    socket.on('vote', async ({ pollId, optionObj, refreshToken }) => {
      try {
        const user = await User.findOne({ where: { refreshToken } });
        if (!user) throw new Error('User not found');
        let poll = await Poll.findOne({ where: { id: pollId } });
        const option = poll.options.filter(o => o.option === optionObj.option)[0];
        if (!option.voters.includes(user.id)) {
          option.votes += 1;
          option.voters.push(user.id);
        }
        poll = await poll.update({ options: poll.options });
        io.emit('poll', { poll, action: 'vote', optionObj: option });
      } catch (err) {
        io.emit('error', { message: err.message });
        console.error(err); // eslint-disable-line
      }
    });

    socket.on('unvote', async ({ pollId, optionObj, refreshToken }) => {
      try {
        const user = await User.findOne({ where: { refreshToken } });
        if (!user) throw new Error('User not found');
        let poll = await Poll.findOne({ where: { id: pollId } });
        const option = poll.options.filter(o => o.option === optionObj.option)[0];
        if (option.voters.includes(user.id)) {
          option.votes -= 1;
          option.voters = option.voters.filter(voter => voter !== user.id);
        }
        poll = await poll.update({ options: poll.options });
        io.emit('poll', { poll, action: 'unvote', optionObj: option });
      } catch (err) {
        io.emit('error', { message: err.message });
        console.error(err); // eslint-disable-line
      }
    });
  });
}
start()
