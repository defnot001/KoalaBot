import type { ApplicationCommandOptionChoiceData } from 'discord.js';
import { mcConfig } from '../../config/config';

export function getServerChoices(): ApplicationCommandOptionChoiceData<string>[] {
  const choices = [];

  for (const server of Object.keys(mcConfig)) {
    choices.push({ name: server, value: server });
  }

  return choices;
}

export function escapeMarkdown(text: string): string {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  return unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
}

export function includesUndefined<T>(array: (T | undefined)[]) {
  return array.includes(undefined);
}

export function humanReadableSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 ** 2) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else if (bytes < 1024 ** 3) {
    return (bytes / 1024 ** 2).toFixed(1) + ' MB';
  } else if (bytes < 1024 ** 4) {
    return (bytes / 1024 ** 3).toFixed(1) + ' GB';
  } else {
    return (bytes / 1024 ** 4).toFixed(1) + ' TB';
  }
}
