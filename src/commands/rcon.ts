import { ApplicationCommandOptionType, codeBlock } from 'discord.js';
import { Command } from '../structures/Command';
import { getServerChoices } from '../util/functions/helpers';
import { mcConfig } from '../config/config';
import { runRconCommand } from '../util/rcon';
import { errorLog } from '../util/functions/loggers';
import getErrorMessage from '../util/functions/errors';
import type { IMinecraftConfig } from '../typings/interfaces/Config';

export default new Command({
  name: 'run',
  description: 'Runs a command on a Minecraft Server.',
  options: [
    {
      name: 'server',
      description: 'Choose a server.',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [...getServerChoices()],
    },
    {
      name: 'command',
      description: 'The command you want to run on the server.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async ({ interaction, args }) => {
    await interaction.deferReply();

    const choice = args.getString('server');
    const command = args.getString('command');

    if (!choice) {
      return interaction.editReply('Please specify a server!');
    }

    if (!command) {
      return interaction.editReply('Please provide a command!');
    }

    if (!interaction.guild) {
      return interaction.reply('This command can only be used in a guild.');
    }

    const { host, rconPort, rconPasswd } =
      mcConfig[choice as keyof IMinecraftConfig];

    try {
      const response =
        (await runRconCommand(host, rconPort, rconPasswd, command)) ||
        'Command run successfully but there is no response.';

      const maxMessageLength = 2000;

      if (response.length > maxMessageLength) {
        return interaction.editReply(
          'The response from the server to this command exceeds the message character limit. Consider using the panel for this specific command next time.',
        );
      }

      interaction.editReply(codeBlock(response.toString()));
    } catch (err) {
      interaction.editReply('Failed to execute the RCON command!');

      errorLog({
        interaction: interaction,
        errorMessage: getErrorMessage(err),
      });
    }
  },
});
