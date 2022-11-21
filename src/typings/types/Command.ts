import type ExtendedInteraction from '../interfaces/ExtendedInteraction';
import type { KoalaClient } from '../../structures/KoalaClient';
import type {
  ChatInputApplicationCommandData,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from 'discord.js';

interface ClientRunOptionsInterface {
  client: KoalaClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type ExecuteFunctions = (options: ClientRunOptionsInterface) => any;

type TCommand = {
  userPermissions?: PermissionResolvable;
  execute: ExecuteFunctions;
} & ChatInputApplicationCommandData;

export default TCommand;
