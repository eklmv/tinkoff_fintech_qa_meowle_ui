const local = {
  catsApi: 'http://localhost:3003',
  reactionApi: 'http://localhost:3002',
  photosApi: 'http://localhost:3001',
};
const production = {
  catsApi: process.env.REACT_APP_CATS_API_URL,
  reactionApi: process.env.REACT_APP_REACTION_URL,
  photosApi: process.env.REACT_APP_PHOTOS_API_URL,
};

export const urls =
  process.env.REACT_APP_API_PROD || process.env.NODE_ENV === 'production'
    ? production
    : local;
