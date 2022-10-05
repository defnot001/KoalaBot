import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { botEnv } from './config/environment.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  console.log(filePath);
  const command = import(filePath);
  console.log(command);
  // client.commands.set(command.data.name, command);
}

// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs
//   .readdirSync(eventsPath)
//   .filter((file) => file.endsWith('.js'));

// for (const file of eventFiles) {
//   const filePath = path.join(eventsPath, file);
//   const event = require(filePath);
//   if (event.once) {
//     client.once(event.name, event.execute);
//   } else {
//     client.on(event.name, event.execute);
//   }
// }

client.login(botEnv.token);
