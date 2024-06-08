import { Storage } from "@plasmohq/storage";
import type { PlasmoCSConfig } from "plasmo";

import { STORAGE_KEYS } from "../consts";
import { getRemainingLikes } from "~api/likes";

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
  all_frames: true,
};
const storage = new Storage();

export const updateRemainingLikes = async () => {
  try {
    const likes = await getRemainingLikes();
    
    await storage.set(STORAGE_KEYS.likes, likes);
    console.log("likes refreshed", likes);
  } catch (error) {
    console.error(error);
  }
};
