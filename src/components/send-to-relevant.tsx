import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import { STORAGE_KEYS } from "~consts";
import { sendMessagesToRelevant } from "~services/matches";

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [progress] = useStorage(STORAGE_KEYS.sentAmount);
  const message =
    "האמת שהתלבטתי קצת מה לשלוח לך, ובסוף החלטתי ללכת עם האינטואיציה שלי שאת תעריכי הודעה אותנטית וישירה, ואומר שפשוט התחשק לי להכיר אותך 😊";

  return (
    <button
      className="plasmo-bg-red-600 plasmo-w-[200px] "
      disabled={isSendingInProgress}
      onClick={async () => {
        setIsSendingInProgress(true);
        await sendMessagesToRelevant({
          passIfNotSpecified: false,
          messageToSend: message,
          filters: {
            isNotSemitrailer: true,
            heightRange: { from: 155, to: 170 },
            isWeed: false,
            isSmoking: false,
          },
        });
        setIsSendingInProgress(false);
      }}
    >
      {!isSendingInProgress
        ? "Send to relevant"
        : `Working on that, soon you will go on a date :) ${progress} sent `}
    </button>
  );
};
