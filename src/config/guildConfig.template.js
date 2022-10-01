// you can change your favorite embed color here using the format 0x+6 hex characters

const guildconfig = {
  embedColor: '',
};

if (!guildconfig.embedColor) {
  throw new Error('embedColor is not defined in guildConfig.js');
}

export default guildconfig;
