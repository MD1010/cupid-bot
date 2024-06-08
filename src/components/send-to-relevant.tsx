import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import { STORAGE_KEYS } from "~consts";
import { sendMessagesToRelevant } from "~services/matches";

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [progress] = useStorage(STORAGE_KEYS.sentAmount);
  const message = "take from store";

  return (
    <button
      className="plasmo-bg-red-600 plasmo-w-[200px] "
      disabled={isSendingInProgress}
      onClick={async () => {
        setIsSendingInProgress(true);
        await sendMessagesToRelevant(message);
        setIsSendingInProgress(false);
      }}
    >
      {!isSendingInProgress
        ? "Send to relevant"
        : `Working on that, soon you will go on a date :) ${progress} sent `}
    </button>
  );
};
