/** @format */

module.exports = {
  name: 'dokdo',
  run: async (client, message, prefix) => {
    new (require('dokdo'))(client, {
      owners: client.owners,
      aliases: ['jsk', 'Jsk'],
      prefix: prefix,
    }).run(message);
  },
};
