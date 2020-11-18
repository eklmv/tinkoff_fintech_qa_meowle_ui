export function runStoreMigrations() {
  runMigrations([convertLikesAndDislikesIntoReactions]);

  function convertLikesAndDislikesIntoReactions() {
    const likes = getFromStor('likes') || {};
    const dislikes = getFromStor('dislikes') || {};
    const mergedMap = {};

    Object.keys(likes).forEach(catId => {
      console.log(
        'catId',
        catId,
        'likes',
        likes[catId],
        'mergedMap',
        mergedMap[catId]
      );
      mergedMap[catId] = likes[catId] ? 'like' : null;
    });
    Object.keys(dislikes).forEach(catId => {
      if (dislikes[catId] && mergedMap[catId]) {
        return (mergedMap[catId] = null);
      }

      if (dislikes[catId] && !mergedMap[catId]) {
        return (mergedMap[catId] = 'dislike');
      }
    });

    const reactions = getFromStor('reactions') || {};

    Object.keys(mergedMap).forEach(catId => {
      reactions[catId] = reactions[catId] || mergedMap[catId];

      if (!reactions[catId]) {
        delete reactions[catId];
      }
    });

    window.localStorage.setItem('reactions', JSON.stringify(reactions));
    window.localStorage.removeItem('likes');
    window.localStorage.removeItem('dislikes');
  }

  function getFromStor(key) {
    let result = null;

    try {
      result = JSON.parse(window.localStorage.getItem(key));
    } catch (e) {}

    return result;
  }
}

function runMigrations(migrations) {
  migrations.forEach(migration => {
    migration();
  });
}
