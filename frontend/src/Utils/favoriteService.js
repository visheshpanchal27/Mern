import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const addFavorite = async (product) => {
  try {
    const { data: favorites } = await axios.get(`${BASE_URL}/api/users/favorites`, { withCredentials: true });
    const alreadyExist = favorites.some((p) => p._id === product._id);

    if (!alreadyExist) {
      const updatedFavorites = [...favorites, product];
      await axios.post(`${BASE_URL}/api/users/favorites`, { favorites: updatedFavorites }, { withCredentials: true });
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

export const removeFavorite = async (productId) => {
  try {
    const { data: favorites } = await axios.get(`${BASE_URL}/api/users/favorites`, { withCredentials: true });
    const updatedFavorites = favorites.filter((product) => product._id !== productId);
    await axios.post(`${BASE_URL}/api/users/favorites`, { favorites: updatedFavorites }, { withCredentials: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

export const getFavorites = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/users/favorites`, { withCredentials: true });
    return data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};
