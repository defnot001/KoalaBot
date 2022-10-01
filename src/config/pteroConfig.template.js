/* 
fill out the values for serverId below and rename this file to pteroConfig.js
if you have more or less servers, you can add or remove them from the object
the value has to be an a string with 8 characters in hex format that you can get from your panel
*/

const pteroconfig = {
  smp: { serverId: '' },
  cmp: { serverId: '' },
  cmp2: { serverId: '' },
  copy: { serverId: '' },
  snapshots: { serverId: '' },
};

for (const server in pteroconfig) {
  if (!pteroconfig[server].serverId) {
    const errorMessage = `Missing Pterodactyl Server ID(s) for ${server} in pteroConfig.js`;
    throw new Error(errorMessage);
  }
}

export default pteroconfig;
