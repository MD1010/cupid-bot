import type { PlasmoCSConfig } from "plasmo";
import { STORAGE_KEYS } from '~consts';

import { updateRemainingLikes } from "~services/likes";
import { setCurrentUserId } from "~services/user";
import { storage } from '~storage';
import { checkInitialLoaded } from "~utils/pageLoad";

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
  all_frames: true,
};

(async () => {
  await storage.setItem(STORAGE_KEYS.sentAmount, 0);
  if (checkInitialLoaded()) {
    await setCurrentUserId();
    await updateRemainingLikes();
  }
})();
