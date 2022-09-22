const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { bot, guild } = require('../config.json');

const rest = new REST({ version: '10' }).setToken(bot.token);

// for guild-based commands
rest
  .delete(
    Routes.applicationGuildCommand(bot.clientId, guild.guildId, 'commandId')
  )
  .then(() => console.log('Successfully deleted guild command'))
  .catch(console.error);

// for global commands
rest
  .delete(Routes.applicationCommand(bot.clientId, 'commandId'))
  .then(() => console.log('Successfully deleted application command'))
  .catch(console.error);
