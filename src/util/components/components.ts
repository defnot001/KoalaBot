import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getServerChoices } from '../functions/helpers';

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

export const mcServerChoice = {
  name: 'server',
  description: 'The server you want to stop.',
  type: 3,
  required: true,
  choices: [...getServerChoices()],
};
