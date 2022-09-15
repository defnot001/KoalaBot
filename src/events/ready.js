const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    client.user.setActivity('Minecraft Servers', {
      type: ActivityType.Watching,
    });
    console.log(`Ready! Logged in as ${client.user.tag}.`);
  },
};
