/* eslint-disable radix */
const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  bold,
} = require('discord.js');

const { embedColor, server } = require('../../config.json');

const escapeMarkdown = (text) => {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
  return escaped;
};

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const buildDefaultEmbed = (user) =>
  new EmbedBuilder({
    color: parseInt(embedColor, 16),
    footer: {
      text: `Requested by ${user.username}.`,
      iconURL: user.displayAvatarURL(),
    },
    timestamp: Date.now(),
  });

const generateServerChoices = () => {
  const choices = [];

  for (const s of Object.getOwnPropertyNames(server)) {
    choices.push({ name: s, value: s });
  }
  return choices;
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const formatTime = (ms) => {
  const roundTowardsZero = ms > 0 ? Math.floor : Math.ceil;
  const days = roundTowardsZero(ms / 86400000);
  const hours = roundTowardsZero(ms / 3600000) % 24;
  const minutes = roundTowardsZero(ms / 60000) % 60;
  const seconds = roundTowardsZero(ms / 1000) % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const buildConfirmButton = (serverChoice, guild, action) => {
  const confirmButton = new ButtonBuilder({
    style: ButtonStyle.Success,
    label: 'Confirm',
    customId: 'confirm',
  });

  const cancelButton = new ButtonBuilder({
    style: ButtonStyle.Danger,
    label: 'Cancel',
    customId: 'cancel',
  });

  const row = new ActionRowBuilder({
    components: [confirmButton, cancelButton],
  });

  const reply = {
    content: `Are you sure you want to ${action} ${guild.name} ${bold(
      serverChoice,
    )}?`,
    components: [row],
  };

  return reply;
};

module.exports = {
  escapeMarkdown,
  capitalizeFirstLetter,
  buildDefaultEmbed,
  generateServerChoices,
  formatBytes,
  formatTime,
  buildConfirmButton,
};
