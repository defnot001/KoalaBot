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

export const escapeMarkdown = (text: string): string => {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  return unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
};

export const includesUndefined = (array: unknown[]) => {
  return array.includes(undefined);
};
