import cssText from "data-text:~style.css";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";

import { LikeCount } from "~components/like-count";
import { SendToRelevant } from '~components/send-to-relevant';

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(".navbar-boost-button"),
  insertPosition: "afterend",
});

const PlasmoOverlay = () => {
  return (
    <div className="plasmo-fixed plasmo-right-[10rem] plasmo-bottom-10">
      <LikeCount />
      <SendToRelevant/>
    </div>
  );
};

export default PlasmoOverlay;
