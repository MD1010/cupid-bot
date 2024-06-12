import { getRemainingLikes } from "~api/likes";
import { STORAGE_KEYS } from "~consts";
import { storage } from "~storage";

export const updateRemainingLikes = async () => {
  try {
    const likes = await getRemainingLikes();
    
    await storage.set(STORAGE_KEYS.likes, likes);
  } catch (error) {
    console.error(error);
  }
};
