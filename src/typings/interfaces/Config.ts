import type { TMinecraftConfig } from '../types/MCConfig';

export interface IENV {
  bot: {
    token: string | undefined;
    clientID: string | undefined;
    guildID: string | undefined;
  };
  ptero: {
    url: string | undefined;
    apiKey: string | undefined;
  };
  rconpasswd: {
    smp: string | undefined;
    cmp: string | undefined;
    cmp2: string | undefined;
    copy: string | undefined;
    snapshots: string | undefined;
  };
  channels: {
    errorLog: string;
  };
  colors: {
    readonly default: number;
    readonly red: number;
    readonly orange: number;
    readonly none: number;
    readonly yellow: number;
    readonly green: number;
  };
}

export interface ICheckedConfig {
  bot: {
    readonly token: string;
    readonly clientID: string;
    readonly guildID: string;
  };
  ptero: {
    readonly url: string;
    readonly apiKey: string;
  };
  rconpasswd: {
    readonly smp: string;
    readonly cmp: string;
    readonly cmp2: string;
    readonly copy: string;
    readonly snapshots: string;
  };
  channels: {
    readonly errorLog: string;
  };
  colors: {
    readonly default: number;
    readonly red: number;
    readonly orange: number;
    readonly none: number;
    readonly yellow: number;
    readonly green: number;
  };
}

export interface IConfig {
  bot: {
    readonly token: string;
    readonly clientID: string;
    readonly guildID: string;
  };
  ptero: {
    readonly url: string;
    readonly apiKey: string;
  };
  channels: {
    readonly errorLog: string;
  };
  colors: {
    readonly default: number;
    readonly red: number;
    readonly orange: number;
    readonly none: number;
    readonly yellow: number;
    readonly green: number;
  };
}

export interface IMinecraftConfig {
  smp: TMinecraftConfig;
  cmp: TMinecraftConfig;
  cmp2: TMinecraftConfig;
  copy: TMinecraftConfig;
  snapshots: TMinecraftConfig;
}
