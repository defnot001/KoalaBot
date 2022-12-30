import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

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

export const confirmCancelRow = new ActionRowBuilder<ButtonBuilder>({
  components: [confirmButton, cancelButton],
});
