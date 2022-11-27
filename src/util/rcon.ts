import { queryFull, RCON } from 'minecraft-server-util';
import getErrorMessage from './functions/errors';
import { mcConfig } from '../config/config';
import type { IMobcap } from '../typings/interfaces/RCON';
import type { FullQueryResponse } from 'minecraft-server-util';

export const getServerStatus = async (
  host: string,
  port: number,
): Promise<FullQueryResponse | undefined> => {
  try {
    return await queryFull(host, port, { enableSRV: true });
  } catch (err) {
    getErrorMessage(err);
  }
};

export const runRconCommand = async (
  host: string,
  rconPort: number,
  rconPassword: string,
  command: string,
): Promise<string | undefined> => {
  const rconClient: RCON = new RCON();

  try {
    await rconClient.connect(host, rconPort);
    await rconClient.login(rconPassword);

    const data = await rconClient.execute(command);

    await rconClient.close();
    return data;
  } catch (err) {
    getErrorMessage(err);
  }
};

export const queryMspt = async (
  host: string,
  rconPort: number,
  rconPassword: string,
): Promise<
  | {
      mspt: number;
      tps: number;
    }
  | undefined
> => {
  const command = `script run reduce(system_info('server_last_tick_times'), _a+_, 0)/100`;
  const data = await runRconCommand(host, rconPort, rconPassword, command);

  if (!data) return;

  const mspt = Math.round(parseFloat(data.split(' ')[2]) * 100) / 100;

  let tps: number;

  if (mspt <= 50) {
    tps = 20;
  } else {
    tps = 1000 / mspt;
  }

  return { mspt, tps };
};

export const queryMobcap = async (
  host: string,
  rconPort: number,
  rconPassword: string,
): Promise<IMobcap | undefined> => {
  const dimensions = ['overworld', 'the_nether', 'the_end'];

  const mobcap: Record<string, string> = {};

  for (const dim of dimensions) {
    const query = `execute in minecraft:${dim} run script run get_mob_counts('monster')`;
    const res = await runRconCommand(host, rconPort, rconPassword, query);

    if (!res) return;

    const data = res
      .replace(/^.{0,3}| \(.*\)|[[\]]/g, '')
      .replace(/, /g, ' | ');

    mobcap[dim as keyof IMobcap] = data;
  }

  const isMobcap = (obj: any): obj is IMobcap => {
    return 'overworld' in obj && 'the_nether' in obj && 'the_end' in obj;
  };

  if (!isMobcap(mobcap)) return;
  return mobcap;
};
