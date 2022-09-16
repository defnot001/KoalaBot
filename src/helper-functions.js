const util = require('minecraft-server-util');
const { EmbedBuilder } = require('discord.js');
const { embedColor, server } = require('../config.json');

const escapeMarkdown = (text) => {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
  return escaped;
};

const buildDefaultEmbed = (user) =>
  new EmbedBuilder({
    color: parseInt(embedColor, 16),
    footer: {
      text: `Requested by ${user.username}.`,
      iconURL: user.displayAvatarURL(),
    },
    timestamp: Date.now(),
  });

const getServerStatus = (host, port) =>
  util.queryFull(host, port, { enableSRV: true });

const runRconCommand = async (host, rconPort, rconPassword, command) => {
  const options = { timeout: 1000 * 5 };
  const rcon = new util.RCON();

  await rcon.connect(host, rconPort, options);
  await rcon.login(rconPassword, options);

  const data = await rcon.execute(command);

  await rcon.close();
  return data;
};

const queryMSPT = async (host, rconPort, rconPassword) => {
  const data = await runRconCommand(
    host,
    rconPort,
    rconPassword,
    `script run reduce(system_info('server_last_tick_times'), _a+_, 0)/100`,
  );

  const mspt = (Math.round(parseFloat(data.split(' ')[2]) * 100) / 100).toFixed(
    2,
  );
  let tps;

  if (mspt <= 50) {
    tps = '20.0';
  } else {
    tps = 1000 / mspt;
  }

  return { mspt, tps };
};

const queryMobcap = async (host, rconPort, rconPassword) => {
  const dimensions = ['overworld', 'the_nether', 'the_end'];
  const mobcap = {};

  for (const dim of dimensions) {
    const query = `execute in minecraft:${dim} run script run get_mob_counts('monster')`;
    const data = await runRconCommand(host, rconPort, rconPassword, query); // eslint-disable-line no-await-in-loop
    mobcap[dim] = data
      .replace(/^.{0,3}| \(.*\)|[[\]]/g, '')
      .replace(/, /g, ' | ');
  }

  return mobcap;
};

const generateServerChoices = () => {
  const choices = [];

  for (const s of Object.getOwnPropertyNames(server)) {
    choices.push({ name: s, value: s });
  }
  return choices;
};

module.exports = {
  escapeMarkdown,
  buildDefaultEmbed,
  getServerStatus,
  runRconCommand,
  queryMSPT,
  queryMobcap,
  generateServerChoices,
};
