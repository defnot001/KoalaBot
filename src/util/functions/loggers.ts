import colors from '../../config/colors';
import { config } from '../../config/config';
import { EmbedBuilder, TextBasedChannel } from 'discord.js';
import { isTextChannel } from './typeChecks';
import type { Guild } from 'discord.js';
import type { IErrorOptions } from '../../typings/interfaces/Errors';

export function errorLog(options: IErrorOptions): void {
  const { client, guild, type, errorMessage } = options;
  const errorLog = getLogChannels(guild);

  if (!client.user) {
    throw new Error('This client does not have a user!');
  }

  const errorEmbed = new EmbedBuilder({
    author: {
      name: client.user.username,
      iconURL: client.user.displayAvatarURL(),
    },
    description: `${errorMessage}`,
    color: type === 'warn' ? colors.yellow : colors.red,
    footer: {
      text: 'KiwiBot Error Log',
    },
    timestamp: Date.now(),
  });

  errorLog.send({ embeds: [errorEmbed] });
}

export const getLogChannels = (guild: Guild): TextBasedChannel => {
  const errorLogChannel = guild.channels.cache.get(config.channels.errorLog);

  if (!errorLogChannel || !isTextChannel(errorLogChannel)) {
    errorLog({
      client: guild.client,
      guild: guild,
      type: 'error',
      errorMessage: `Cannot get the log-channels.`,
    });
    throw new Error('Cannot get the log-Channels!');
  }
  return errorLogChannel;
};
