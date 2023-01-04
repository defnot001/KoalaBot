import { GuildBasedChannel, TextChannel } from 'discord.js';

export function isTextChannel(
  channel: GuildBasedChannel,
): channel is TextChannel {
  return channel instanceof TextChannel;
}
