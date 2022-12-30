import {
  ApplicationCommandOptionType,
  bold,
  ComponentType,
  inlineCode,
  time,
} from 'discord.js';
import { mcConfig } from '../config/config';
import { Command } from '../structures/Command';
import { KoalaEmbedBuilder } from '../structures/embeds/KoalaEmbedBuilder';
import type { IMinecraftConfig } from '../typings/interfaces/Config';
import { confirmCancelRow } from '../util/components/buttons';
import getErrorMessage from '../util/functions/errors';
import { getServerChoices } from '../util/functions/helpers';
import { errorLog } from '../util/functions/loggers';
import { ptero } from '../util/pterodactyl';

export default new Command({
  name: 'backup',
  description: 'Control backups on a minecraft server.',
  options: [
    {
      name: 'list',
      description: 'Lists all backups from a minecraft server.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'server',
          description: 'The server you want to get the backups from.',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [...getServerChoices()],
        },
      ],
    },
    {
      name: 'create',
      description: 'Creates a backup on a minecraft server.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'server',
          description: 'The server you want to create a backup on.',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [...getServerChoices()],
        },
        {
          name: 'name',
          description: 'The name of the backup.',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: 'locked',
          description: 'Whether or not the backup is locked.',
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
  ],
  execute: async ({ interaction, args }) => {
    await interaction.deferReply();

    const subcommand = args.getSubcommand();
    const choice = args.getString('server');
    const guild = interaction.guild;

    if (!guild) {
      return interaction.editReply(
        'This command can only be used in a server.',
      );
    }

    if (!choice) {
      return interaction.editReply('Please choose a server.');
    }

    const serverChoice = choice as keyof IMinecraftConfig;
    const { serverId } = mcConfig[serverChoice];

    if (subcommand === 'list') {
      try {
        const { data } = await ptero.backups.list(serverId);

        const transformedList = data.slice(-20).map((backup) => {
          const { name, uuid, created_at } = backup;
          return `${time(created_at, 'f')}\n${bold(name)}\n${inlineCode(uuid)}`;
        });

        const backupListEmbed = new KoalaEmbedBuilder(interaction.user, {
          description: transformedList.join('\n\n'),
        });

        return interaction.editReply({ embeds: [backupListEmbed] });
      } catch (err) {
        getErrorMessage(err);
        return errorLog({
          interaction: interaction,
          errorMessage: `Failed to list backups for ${serverChoice}!`,
        });
      }
    } else if (subcommand === 'create') {
      if (mcConfig[serverChoice].backupLimit === 0) {
        return interaction.editReply(
          `You can not create a backup for ${interaction.guild.name} ${bold(
            serverChoice,
          )} because this server does not allow backups.`,
        );
      }

      const backupName =
        args.getString('name') ?? `Backup created by KoalaBot at ${new Date()}`;

      const locked = args.getBoolean('locked') ?? false;

      try {
        const backupData = await ptero.backups.list(serverId);

        if (
          backupData.meta.pagination.total < mcConfig[serverChoice].backupLimit
        ) {
          const backup = await ptero.backups.create(serverId, {
            backupName,
            locked,
          });

          return interaction.editReply(
            `Successfully created backup (${inlineCode(backup.name)}) for ${
              interaction.guild.name
            } ${bold(serverChoice)}!`,
          );
        } else {
          await interaction.editReply({
            content: `This command will delete the oldest backup for ${
              interaction.guild.name
            } ${bold(
              serverChoice,
            )} because the backup limit is reached for this server. Are you sure you want to continue? This can not be undone!`,
            components: [confirmCancelRow],
          });

          if (!interaction.channel) {
            return interaction.editReply(
              'This command can only be used in a text channel.',
            );
          }

          const collector =
            interaction.channel.createMessageComponentCollector<ComponentType.Button>(
              {
                time: 10000,
                max: 1,
                filter: (click) => click.user.id === interaction.user.id,
              },
            );

          collector.on('collect', async (i) => {
            if (i.customId === 'confirm') {
              await ptero.backups.delete(serverId, backupData.data[0]!.uuid);
              const backup = await ptero.backups.create(serverId, {
                backupName,
                locked,
              });

              interaction.editReply({
                content: `Successfully deleted oldest backup and created backup (${inlineCode(
                  backup.name,
                )}) for ${guild.name} ${bold(serverChoice)}!`,
                components: [],
              });
            } else {
              interaction.editReply({
                content: `Cancelled deleting the oldest backup for ${
                  guild.name
                } ${bold(serverChoice)}!`,
                components: [],
              });
            }
          });
        }
      } catch (err) {
        getErrorMessage(err);
        return errorLog({
          interaction: interaction,
          errorMessage: `Failed to create a backup for ${serverChoice}!`,
        });
      }
    }
    // return interaction.editReply('This is currently being tested.');
  },
});
