import type { ClientEvents } from 'discord.js';

// export class Event<Key extends keyof ClientEvents> {
//   constructor(
//     public event: Key,
//     public execute: (...args: ClientEvents[Key]) => unknown,
//   ) {}
// }

export class Event<K extends keyof ClientEvents> {
  constructor(
    public event: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public execute: (...args: ClientEvents[K]) => void,
  ) {}
}
