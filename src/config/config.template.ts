import dotenv from 'dotenv';
import { env } from 'process';
import type { IConfig, IENV } from '../typings/interfaces/Config';

dotenv.config();

const environment: IENV = {
  bot: {
    token: env.BOT_TOKEN,
    clientID: env.CLIENT_ID,
    guildID: env.GUILD_ID,
  },
  ptero: {
    url: env.URL,
    apiKey: env.API_KEY,
  },
  rconpasswd: {
    smp: env.SMP_RCON_PASSWORD,
    cmp: env.CMP_RCON_PASSWORD,
    cmp2: env.CMP2_RCON_PASSWORD,
    copy: env.COPY_RCON_PASSWORD,
    snapshots: env.SNAPSHOTS_RCON_PASSWORD,
  },
  channels: {
    errorLog: '', // Insert Error Log Channel ID here.
  },
};

const checkConfig = (cfg: IENV): IConfig | never => {
  const configs: Record<string, string>[] = Object.values(cfg);
  configs.forEach((element) => {
    for (const [key, value] of Object.entries(element)) {
      if (!value) {
        throw new Error(
          `Missing value of "${key}" in the config! Make sure to check the files ".env" & "config.ts".`,
        );
      }
    }
  });
  return cfg as IConfig;
};

const config = checkConfig(environment);
export default config;
