import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../structures/Command';
import { KoalaEmbedBuilder } from '../structures/embeds/KoalaEmbedBuilder';
import { getServerChoices } from '../util/functions/helpers';
import { getWhitelist } from '../util/rcon';
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
    const ign = args.getString('ign');
    const choice = args.getString('server');

    if (!subcommand) {
      return interaction.editReply('This subcommand does not exist!');
    }

    // if (!ign) {
    //   return interaction.editReply('Please provide an in-game name!');
    // }

    if (!interaction.guild) {
      return interaction.reply('This command can only be used in a guild.');
    }

    const { host, rconPort, rconPasswd } =
      mcConfig[choice as keyof IMinecraftConfig];

    if (subcommand === 'list') {
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
    }
  },
});
