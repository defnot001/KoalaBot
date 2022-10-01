const Nodeactyl = require('nodeactyl');
const { bold } = require('discord.js');
const { pterodactyl } = require('../../../config.json');

const ptero = new Nodeactyl.NodeactylClient(
  pterodactyl.url,
  pterodactyl.apiKey
);

const startServer = async (serverId, serverChoice) => {
  const start = await ptero.startServer(serverId);

  if (start === true) {
    return `Successfully started Server ${bold(serverChoice)}!`;
  }
  return `Failed to start Server ${bold(serverChoice)}!`;
};

module.exports = { startServer };
