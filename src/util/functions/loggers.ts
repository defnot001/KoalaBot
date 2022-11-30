import { config } from '../../config/config';
import { EmbedBuilder } from 'discord.js';
import { isTextChannel } from './typeChecks';
import type { Guild } from 'discord.js';
import type { IInteractionErrorOptions } from '../../typings/interfaces/Errors';

export const errorLog = async (options: IInteractionErrorOptions) => {
  const { interaction, errorMessage } = options;

  if (!interaction.guild) {
    throw new Error('This interaction was not created in a guild!');
  }

  const errorLog = await getLogChannels(interaction.guild);

  if (!interaction.client.user) {
    throw new Error('This client does not have a user!');
  }

  const clientUser = interaction.client.user;

  const chatInputInteractionErrorEmbed = new EmbedBuilder({
    author: {
      name: clientUser.username,
      iconURL: clientUser.displayAvatarURL(),
    },
    description: `${errorMessage}`,
    color: config.colors.red,
    footer: {
      text: `${clientUser.username} Error Log`,
    },
    timestamp: Date.now(),
  });

  errorLog.send({ embeds: [chatInputInteractionErrorEmbed] });
};

export const getLogChannels = async (guild: Guild) => {
  const errorLogChannel = await guild.channels.fetch(config.channels.errorLog);

  if (!errorLogChannel || !isTextChannel(errorLogChannel)) {
    throw new Error('Cannot get the error-log channel!');
  }

  return errorLogChannel;
};
