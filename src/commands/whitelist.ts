import { ApplicationCommandOptionType, inlineCode } from 'discord.js';
import { Command } from '../structures/Command';
import { KoalaEmbedBuilder } from '../structures/embeds/KoalaEmbedBuilder';
import { getServerChoices, includesUndefined } from '../util/functions/helpers';
import { getWhitelist, runRconCommand } from '../util/rcon';
import { errorLog } from '../util/functions/loggers';
import { mcConfig } from '../config/config';
import type { IMinecraftConfig } from '../typings/interfaces/Config';

export default new Command({
  name: 'whitelist',
  description: 'Get information about the whitelist & add/remove users.',
  options: [
    {
      name: 'add',
      description: 'Adds a player to the whitelist on all minecraft servers.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'ign',
          description: `The player's in-game name.`,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'remove',
      description:
        'Removes a player from the whitelist on all minecraft servers.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'ign',
          description: `The player's in-game name.`,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'list',
      description: 'Returns the whitelist of the specified server in an embed.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'server',
          description: `Specify a server.`,
          type: ApplicationCommandOptionType.String,
          choices: [...getServerChoices()],
          required: true,
        },
      ],
    },
  ],
  execute: async ({ interaction, args }) => {
    await interaction.deferReply();

    const subcommand = args.getSubcommand();

    if (!subcommand) {
      return interaction.editReply('This subcommand does not exist!');
    }

    if (!interaction.guild) {
      return interaction.reply('This command can only be used in a guild.');
    }

    if (subcommand === 'list') {
      const choice = args.getString('server');
      const { host, rconPort, rconPasswd } =
        mcConfig[choice as keyof IMinecraftConfig];

      if (!choice) {
        return interaction.editReply('Please specify a server!');
      }

      const response = await getWhitelist(host, rconPort, rconPasswd);

      if (!response) {
        errorLog({
          client: interaction.client,
          guild: interaction.guild,
          type: 'error',
          errorMessage: `Failed to get the whitelist for ${choice}!`,
        });

        return interaction.editReply(
          `Failed to get the whitelist for ${choice}!`,
        );
      }

      const whitelist =
        response instanceof Array ? response.join('\n') : response;

      const whitelistEmbed = new KoalaEmbedBuilder(interaction.user, {
        title: `${choice.toUpperCase()} Whitelist`,
        description: whitelist,
      });

      const iconURL = interaction.guild.iconURL();

      if (iconURL) {
        whitelistEmbed.setThumbnail(iconURL);
      }

      interaction.editReply({ embeds: [whitelistEmbed] });
    } else if (subcommand === 'add' || subcommand === 'remove') {
      const ign = args.getString('ign');

      if (!ign) {
        return interaction.editReply('Please provide an in-game name!');
      }

      const servers = Object.keys(mcConfig);

      const whitelistCheck: [string, string | undefined][] = [];
      const opCheck: [string, string | undefined][] = [];

      for await (const server of servers) {
        const { host, rconPort, rconPasswd } =
          mcConfig[server as keyof IMinecraftConfig];

        const whitelistCommand = `whitelist ${subcommand} ${ign}`;

        const whitelist = await runRconCommand(
          host,
          rconPort,
          rconPasswd,
          whitelistCommand,
        );

        whitelistCheck.push([server, whitelist]);

        if (mcConfig[server as keyof IMinecraftConfig].operator) {
          const action = subcommand === 'add' ? 'op' : 'deop';
          const opCommand = `${action} ${ign}`;

          const op = await runRconCommand(
            host,
            rconPort,
            rconPasswd,
            opCommand,
          );

          opCheck.push([server, op]);
        }
      }

      if (includesUndefined(opCheck) || includesUndefined(whitelistCheck)) {
        const failMessage =
          subcommand === 'add'
            ? `Failed to whitelist and/or op ${inlineCode(
                ign,
              )} on one or more servers!`
            : `Failed to unwhitelist and/or deop ${inlineCode(
                ign,
              )} on one or more servers!`;

        errorLog({
          client: interaction.client,
          guild: interaction.guild,
          type: 'warn',
          errorMessage: `Failed to ${subcommand} ${ign} to/from the whitelist!`,
        });

        return interaction.editReply(failMessage);
      }

      const successMessage =
        subcommand === 'add'
          ? `Successfully added ${inlineCode(ign)} to the whitelist on ${
              whitelistCheck.length
            } servers.\nSuccessfully made ${inlineCode(ign)} an operator on ${
              opCheck.length
            } servers.`
          : `Successfully removed ${inlineCode(ign)} from the whitelist on ${
              whitelistCheck.length
            } servers.\nSuccessfully removed ${inlineCode(
              ign,
            )} as an operator on ${opCheck.length} servers.`;

      interaction.editReply(successMessage);
    }
  },
});
