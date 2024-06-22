import { MAX_RETRIES, STORAGE_KEYS } from "@/consts";
import { sendMessagesToRelevant } from "@/services/matches";
import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import { Button } from "./ui/button";
import { sendMessageToTargetId } from "@/services/messages";

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [foundMatches] = useStorage(STORAGE_KEYS.foundMatches);
  const [filters] = useStorage(STORAGE_KEYS.filters);
  const [remainingLikes] = useStorage(STORAGE_KEYS.likes);

  const message2 = "";

  const sendToSpecificId = async () => {
    setIsSendingInProgress(true);
    await sendMessageToTargetId("5664254551947394216", message2);
    setIsSendingInProgress(false);
  };

  return (
    <>
      <Button
        disabled={!remainingLikes}
        variant="default"
        isLoading={isSendingInProgress}
        onClick={async () => {
          while (remainingLikes) {
            setIsSendingInProgress(true);
            const currentIterationSent = await sendMessagesToRelevant(filters);
            setIsSendingInProgress(false);
            if (!currentIterationSent) break;
          }
        }}
      >
        {isSendingInProgress ? (
          foundMatches ? (
            <div>Found {foundMatches} new matches</div>
          ) : (
            `Working on that :)`
          )
        ) : remainingLikes ? (
          "Match"
        ) : (
          "No likes remaining"
        )}
      </Button>

      {/* <button
        className="bg-red-600 w-[200px] mx-10"
        disabled={isSendingInProgress}
        onClick={sendToSpecificId}
      >
        Send to specific one
      </button> */}
    </>
  );
};
