import Nodeactyl from 'nodeactyl';
import pteroconfig from '../../config/pteroConfig.js';

const pteroClient = new Nodeactyl.NodeactylClient(
  pteroconfig.url,
  pteroconfig.apikey
);

console.log(pteroClient);

export default pteroClient;
