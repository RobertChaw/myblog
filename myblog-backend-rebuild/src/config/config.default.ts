import {MidwayConfig} from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1669902130627_1085',
  session: {
    renew: true,
  },
  koa: {
    port: 7777,
  },
  cos: {
    client: {
      SecretId: 'AKIDOgmgT4YjmeLqeKG7FB6qNiNwJUTGrY5T',
      SecretKey: 'PglgzBHCuPjwyxqYNdmjU4TffjgS2Vns',
    },
  },
  passport: {
    session: true,
    sessionUserProperty: 'user',
  },
  httpProxy: {
    match: /\/api\/location\/(.*)$/,
    target: 'https://nominatim.openstreetmap.org/$1',
  },
  midwayLogger: {
    default: {
      dir: '/logs',
    },
  },
} as MidwayConfig;
