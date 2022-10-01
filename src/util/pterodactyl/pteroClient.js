import Nodeactyl from 'nodeactyl';
import pteroconfig from '../../config/pteroConfig';

const pteroClient = new Nodeactyl.NodeactylClient(
  pteroconfig.url,
  pteroconfig.apiKey
);

export default pteroClient;
