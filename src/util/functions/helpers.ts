import { mcConfig } from '../../config/config';
import type { ApplicationCommandOptionChoiceData } from 'discord.js';

export const getServerChoices =
  (): ApplicationCommandOptionChoiceData<string>[] => {
    const choices = [];

    for (const server of Object.keys(mcConfig)) {
      choices.push({ name: server, value: server });
    }

    return choices;
  };