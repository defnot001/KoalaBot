const { SlashCommandBuilder, time } = require('discord.js');
const Nodeactyl = require('nodeactyl');
const {
  generateServerChoices,
  capitalizeFirstLetter,
  buildDefaultEmbed,
} = require('../util/helper-functions');
const { server, pterodactyl } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Control Backups on a Minecraft Server.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('Lists all Backups from a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want get the Backups from.')
            .setRequired(true)
            .addChoices(...generateServerChoices())
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Creates a Backup on a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want to create a Backup on.')
            .setRequired(true)
            .addChoices(...generateServerChoices())
        )
        .addStringOption((option) =>
          option
            .setName('backupname')
            .setDescription('The Name you want to give the Backup.')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Deletes a Backup from a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want to delete the Backup from.')
            .setRequired(true)
            .addChoices(...generateServerChoices())
        )
        .addStringOption((option) =>
          option
            .setName('backupname')
            .setDescription('The name of the backup you want to delete.')
            .setRequired(true)
            .addChoices(...generateServerChoices())
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('download')
        .setDescription(
          'Gets a clickable URL to download a Minecraft Server Backup.'
        )
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The server you want to download a Backup from.')
            .setRequired(true)
            .addChoices(...generateServerChoices())
        )
        .addStringOption((option) =>
          option
            .setName('backupname')
            .setDescription('The name of the backup you want to download.')
            .setRequired(true)
            .addChoices(...generateServerChoices())
        )
    ),
  async execute(interaction) {
    const choice = interaction.options.getString('server');
    const serverChoice = capitalizeFirstLetter(choice);
    const subcommand = interaction.options.getSubcommand();
    const { serverid } = server[choice];
    const { url, apiKey } = pterodactyl;

    const ptero = new Nodeactyl.NodeactylClient(url, apiKey);

    if (subcommand === 'list') {
      const backupList = await ptero.listServerBackups(serverid);
      let backupNames = [];

      for (let i = 0; i < backupList.length; i += 1) {
        const backup = backupList[i];
        const timestamp =
          new Date(backup.attributes.created_at).getTime() / 1000;

        backupNames.push(
          `${i + 1}.
          **Time**: ${time(timestamp, 'F')}
          **Name**: ${backup.attributes.name}\n`
        );
      }

      if (backupNames.length > 25) {
        backupNames = backupNames.slice(-25);
      }

      const backupListEmbed = buildDefaultEmbed(interaction.user)
        .setTitle(
          `Backup list for ${
            interaction.guild.name
          } ${serverChoice.toUpperCase()}`
        )
        .setThumbnail(interaction.guild.iconURL())
        .setDescription(backupNames.join('\n'));

      interaction.reply({ embeds: [backupListEmbed] });
    }
  },
};
