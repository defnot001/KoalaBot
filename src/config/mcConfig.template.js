/* 

This file is used to configure your minecraft servers.
If you have more or less servers, you can add or remove them in the ob object below.

- host is the ip address of the server
- port is the port of the server
- rconPort is the port of the rcon server, that you can define in your server.properties file
- rconPassword is the password of the rcon server, that you can define in your server.properties file
- operator is a boolean that defines if the user is an operator on the server (needed for whitelist command)

*/

import dotenv from 'dotenv';

dotenv.config();

const mcconfig = {
  smp: {
    host: 'smp.example.com',
    port: 25565,
    rconPort: 25566,
    rconPassword: process.env.SMP_RCON_PASSWORD,
    operator: false,
  },
  cmp: {
    host: 'cmp.example.com',
    port: 25575,
    rconPort: 25576,
    rconPassword: process.env.CMP_RCON_PASSWORD,
    operator: true,
  },
  cmp2: {
    host: 'cmp2.example.com',
    port: 25585,
    rconPort: 25586,
    rconPassword: process.env.CMP2_RCON_PASSWORD,
    operator: true,
  },
  copy: {
    host: 'copy.example.com',
    port: 25595,
    rconPort: 25596,
    rconPassword: process.env.COPY_RCON_PASSWORD,
    operator: true,
  },
  snapshots: {
    host: 'snapshots.example.com',
    port: 25605,
    rconPort: 25606,
    rconPassword: process.env.SNAPSHOTS_RCON_PASSWORD,
    operator: true,
  },
};

for (const server in mcconfig) {
  if (!mcconfig[server].rconPassword) {
    const errorMessage = `Missing RCON Password(s) for ${server} in mcConfig.js`;
    throw new Error(errorMessage);
  }
}

export default mcconfig;
