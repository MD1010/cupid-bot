import { Storage } from "@plasmohq/storage";
import type { PlasmoCSConfig } from "plasmo";

import { STORAGE_KEYS } from "../consts";
import { getRemainingLikes } from "~api/likes";

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
  all_frames: true,
};

(async () => {
  try {
    const storage = new Storage();
    const likes = await getRemainingLikes();
    await storage.set(STORAGE_KEYS.likes, likes);
  } catch (error) {
    console.error(error);
  }
})();
