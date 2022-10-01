import { bold } from 'discord.js';
import pteroClient from './pteroClient';

export default async function startServer(serverId, serverChoice) {
  const start = await pteroClient.startServer(serverId);

  return start
    ? `Successfully started Server ${bold(serverChoice)}!`
    : `Failed to start Server ${bold(serverChoice)}!`;
}
