import { serverStart } from '../lib';
import sources from '../test/sources';

serverStart(sources, { port: 2121, webSocketEnabled: true, cors: true });
