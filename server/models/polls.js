const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function generateHex(length) {
  return crypto.randomBytes(length / 2).toString('hex');
}

module.exports = (sequelize, Sequelize) => {
  const Poll = sequelize.define('Poll', {
    title: Sequelize.STRING,
    category: Sequelize.STRING,
    visibility: Sequelize.STRING,
    addingBy: Sequelize.STRING,
    closeAt: Sequelize.DATE,
    options: Sequelize.JSON,
    secret: Sequelize.STRING,
    votes: Sequelize.INTEGER,
  });

  Poll.associate = (models) => {
    Poll.belongsTo(models.User);
  };

  Poll.hook('beforeSave', async (poll, _options) => {
    if (poll.visibility === 'Private' && !poll.secret) {
      const secret = generateHex(16);
      poll.secret = secret;
    }
  });

  return Poll;
};
