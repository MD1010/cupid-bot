import { LikeCount } from '@/components/like-count';
import { SendToRelevant } from '@/components/send-to-relevant';
import cssText from "data-text:~style.css";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";


export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

// export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
//   element: document.querySelector(".navbar-boost-button"),
//   insertPosition: "afterend",
// });

const PlasmoOverlay = () => {
  return (
    <div className="fixed right-[10rem] bottom-10">
      <LikeCount />
      <SendToRelevant/>
    </div>
  );
};

export default PlasmoOverlay;
