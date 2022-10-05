import { SlashCommandBuilder, codeBlock } from 'discord.js';
import rconCommand from '../util/mcserver/rconCommand.js';
import generateServerChoices from '../util/discord_helpers/serverChoices.js';
import mcconfig from '../config/mcConfig.js';

// const { SlashCommandBuilder, codeBlock } = require('discord.js');
// const {
//   runRconCommand,
//   generateServerChoices,
// } = require('../util/helper-functions');
// const { server } = require('../../config.json');

const runRconCommand = {
  data: new SlashCommandBuilder()
    .setName('run')
    .setDescription('Runs a command on a Minecraft Server.')
    .addStringOption((option) =>
      option
        .setName('server')
        .setDescription('The server you want to run a command on.')
        .setRequired(true)
        .addChoices(...generateServerChoices())
    )
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('The command you want to run on the server')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const choice = interaction.options.getString('server');
    const command = interaction.options.getString('command');

    const { host, rconPort, rconPassword } = mcconfig[choice];

    const response =
      (await rconCommand(host, rconPort, rconPassword, command)) ||
      `Command ran successfully, but there's no response.`;

    const maxMessageLength = 2000;

    if (response.length < maxMessageLength) {
      await interaction.editReply(codeBlock(response.toString()));
    } else {
      await interaction.editReply(
        'The response from the server to this command exceeds the message character limit. Consider using the panel for this specific command next time.'
      );
    }
  },
};

export default runRconCommand;
