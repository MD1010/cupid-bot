import type { PlasmoCSConfig } from "plasmo";

import { updateRemainingLikes } from "~services/likes";
import { checkInitialLoaded } from "~utils/pageLoad";

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
  all_frames: true,
};

if (checkInitialLoaded()) {
  updateRemainingLikes();
}
