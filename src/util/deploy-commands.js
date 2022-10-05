import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { botEnv } from '../config/environment.js';

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(botEnv.token);

rest
  .put(Routes.applicationGuildCommands(botEnv.clientId, botEnv.guildId), {
    body: commands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
