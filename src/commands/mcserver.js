const { SlashCommandBuilder, bold } = require('discord.js');
const Nodeactyl = require('nodeactyl');
const {
  generateServerChoices,
  buildDefaultEmbed,
  formatBytes,
  formatTime,
} = require('../helper-functions');
const { server, pterodactyl } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcserver')
    .setDescription('Control a Minecraft Server.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('start')
        .setDescription('Starts a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want to start.')
            .setRequired(true)
            .addChoices(...generateServerChoices()),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('stop')
        .setDescription('Stops a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want to stop.')
            .setRequired(true)
            .addChoices(...generateServerChoices()),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('restart')
        .setDescription('Restarts a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want to restart.')
            .setRequired(true)
            .addChoices(...generateServerChoices()),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('kill')
        .setDescription('Kills a Minecraft Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The Server you want to kill.')
            .setRequired(true)
            .addChoices(...generateServerChoices()),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('stats')
        .setDescription('Returns the Usage Statistics of a Server.')
        .addStringOption((option) =>
          option
            .setName('server')
            .setDescription('The server you want to get Usage Statistics from.')
            .setRequired(true)
            .addChoices(...generateServerChoices()),
        ),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const choice = interaction.options.getString('server');
    const serverChoice = `${choice[0].toUpperCase()}${choice
      .slice(1)
      .toLowerCase()}`;
    const { serverid } = server[choice];
    const { url, apiKey } = pterodactyl;

    const ptero = new Nodeactyl.NodeactylClient(url, apiKey);

    try {
      if (interaction.options.getSubcommand() === 'start') {
        const start = await ptero.startServer(serverid);
        if (start === true) {
          interaction.editReply(
            `Successfully started Server ${bold(serverChoice)}!`,
          );
        } else {
          interaction.editReply(
            `Failed at starting Server ${bold(serverChoice)}!`,
          );
        }
        return;
      }
      if (interaction.options.getSubcommand() === 'stop') {
        const stop = await ptero.stopServer(serverid);
        if (stop === true) {
          interaction.editReply(
            `Successfully stopped Server ${bold(serverChoice)}!`,
          );
        } else {
          interaction.editReply(
            `Failed at stopping Server ${bold(serverChoice)}!`,
          );
        }
        return;
      }
      if (interaction.options.getSubcommand() === 'restart') {
        const restart = await ptero.restartServer(serverid);
        if (restart === true) {
          interaction.editReply(
            `Successfully restarted Server ${bold(serverChoice)}!`,
          );
        } else {
          interaction.editReply(
            `Failed at restarting Server ${bold(serverChoice)}!`,
          );
        }
        return;
      }
      if (interaction.options.getSubcommand() === 'kill') {
        const kill = ptero.killServer(serverid);
        if (kill === true) {
          interaction.editReply(
            `Successfully killed Server ${bold(serverChoice)}!`,
          );
        } else {
          interaction.editReply(
            `Failed at killing Server ${bold(serverChoice)}!`,
          );
        }
        return;
      }
      if (interaction.options.getSubcommand() === 'stats') {
        const stats = await ptero.getServerUsages(serverid);

        if (stats.current_state !== 'running') {
          interaction.editReply(
            `Server ${bold(serverChoice)} is currently ${stats.current_state}!`,
          );
          return;
        }

        const state = `${stats.current_state[0].toUpperCase()}${stats.current_state
          .slice(1)
          .toLowerCase()}`;
        const cpu = `${parseFloat(stats.resources.cpu_absolute).toFixed(2)}%`;
        const memory = formatBytes(stats.resources.memory_bytes);
        const disk = formatBytes(stats.resources.disk_bytes);
        const uptime = formatTime(stats.resources.uptime);

        const statsEmbed = buildDefaultEmbed(interaction.user)
          .setTitle(`Server Stats KiwiTech ${serverChoice}`)
          .setThumbnail(interaction.guild.iconURL())
          .addFields([
            { name: 'State', value: state },
            { name: 'Uptime', value: uptime },
            { name: 'CPU', value: cpu, inline: true },
            { name: 'Memory', value: memory.toString(), inline: true },
            { name: 'Disk', value: disk.toString(), inline: true },
          ]);

        let embedColor = 'Green';
        if (state === 'starting' || state === 'stopping') {
          embedColor = 'Yellow';
        } else if (state === 'offline') {
          embedColor = 'Red';
        }

        statsEmbed.setColor(embedColor);

        interaction.editReply({ embeds: [statsEmbed] });
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: `Something went wrong trying to execute the command for the server ${bold(
          serverChoice,
        )}!`,
        ephemeral: true,
      });
    }
  },
};
