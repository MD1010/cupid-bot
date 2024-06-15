import { InfoCount } from '@/components/info-count';
import { SendToRelevant } from '@/components/send-to-relevant';
import cssText from "data-text:~style.css";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import "../../globals.css"


export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(".navbar-container"),
  insertPosition: "afterend",
});

const PlasmoOverlay = () => {
  return (
    <div className="relative flex gap-5 top-[10px] items-center">
      <SendToRelevant/>
      <InfoCount />
    </div>
  );
};

export default PlasmoOverlay;
