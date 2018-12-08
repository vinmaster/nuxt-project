
const express = require('express')
const consola = require('consola')
const api = require('./api')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8000

app.set('port', port)

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

  // Api routes
  app.use('/api', api);

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
