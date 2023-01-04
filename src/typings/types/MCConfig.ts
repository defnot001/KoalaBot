export type TMinecraftConfig = {
  readonly host: string;
  readonly port: number;
  readonly serverId: string;
  readonly rconPort: number;
  readonly rconPasswd: string;
  readonly operator: boolean;
  readonly backupLimit: number;
};
