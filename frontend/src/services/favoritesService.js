const FAVORITES_KEY = 'beautician_favorites';

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
};

export const isFavorite = (beauticianId) => getFavorites().includes(Number(beauticianId));

export const toggleFavorite = (beauticianId) => {
  const id = Number(beauticianId);
  const favs = getFavorites();
  const index = favs.indexOf(id);
  if (index > -1) {
    favs.splice(index, 1);
  } else {
    favs.push(id);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs.includes(id);
};

export const getFavoriteIds = () => getFavorites();
