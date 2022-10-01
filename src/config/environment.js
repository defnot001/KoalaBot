import dotenv from 'dotenv';

dotenv.config();

export const botEnv = {
  token: process.env.Bot_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
};

export const pteroEnv = {
  url: process.env.URL,
  apikey: process.env.API_KEY,
};

export const rconPasswd = {
  smp: process.env.SMP_RCON_PASSWORD,
  cmp: process.env.CMP_RCON_PASSWORD,
  cmp2: process.env.CMP2_RCON_PASSWORD,
  copy: process.env.COPY_RCON_PASSWORD,
  snapshots: process.env.SNAPSHOTS_RCON_PASSWORD,
};

const errors = [];

for (const prop in botEnv) {
  if (!botEnv[prop]) {
    errors.push(`Missing ${prop} in .env`);
  }
}

for (const prop in pteroEnv) {
  if (!pteroEnv[prop]) {
    errors.push(`Missing ${prop} in .env`);
  }
}

for (const prop in rconPasswd) {
  if (!rconPasswd[prop]) {
    errors.push(`Missing ${prop} in .env`);
  }
}

throw new Error(errors.join('\n'));
