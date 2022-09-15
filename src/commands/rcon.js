const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { runRconCommand } = require('../helper-functions');
const { server } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('run')
    .setDescription('Runs a command on a Minecraft Server.')
    .addStringOption((option) =>
      option
        .setName('server')
        .setDescription('The server you want to run a command on.')
        .setRequired(true)
        .addChoices(
          { name: 'smp', value: 'smp' },
          { name: 'cmp', value: 'cmp' },
          { name: 'cmp2', value: 'cmp2' },
          { name: 'copy', value: 'copy' },
          { name: 'snapshots', value: 'snapshots' },
        ),
    )
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('The command you want to run on the server')
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const choice = interaction.options.getString('server');
    const command = interaction.options.getString('command');

    const { ip, rconPort, rconPassword } = server[choice];

    try {
      const response =
        (await runRconCommand(ip, rconPort, rconPassword, command)) ||
        `Command ran successfully, but there's no response.`;

      const maxMessageLength = 2000;

      if (response.length < maxMessageLength) {
        await interaction.editReply(codeBlock(response.toString()));
      } else {
        await interaction.editReply(
          'The response from the server to this command exceeds the message character limit. Consider using the panel for this specific command next time.',
        );
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply('Server offline or unreachable!');
    }
  },
};
