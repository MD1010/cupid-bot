import type { PlasmoCSConfig } from "plasmo";

import { updateRemainingLikes } from "~services/likes";
import { sendMessagesToRelevant } from "~services/matches";
import { setCurrentUserId } from "~services/user";
import { checkInitialLoaded } from "~utils/pageLoad";

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
  all_frames: true,
};

(async () => {
  if (checkInitialLoaded()) {
    await setCurrentUserId();
    await updateRemainingLikes();
  }
})();
