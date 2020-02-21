const local = {
  catsApi: 'http://localhost:3001',
  reactionApi: 'http://localhost:3001',
};
const production = {
  catsApi: 'https://cats.bobrovartem.ru/api',
  reactionApi: 'https://cats.bobrovartem.ru/api/likes',
};

export const urls = process.env.NODE_ENV === 'production' ? production : local;
