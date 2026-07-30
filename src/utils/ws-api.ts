const WS_URL = (process.env.BURGER_API_URL as string)
  .replace(/^http/, 'ws')
  .replace(/\/api$/, '');

export const FEED_WS_URL = `${WS_URL}/orders/all`;

export const getUserOrdersWsUrl = (accessToken: string) =>
  `${WS_URL}/orders?token=${accessToken.replace('Bearer ', '')}`;
