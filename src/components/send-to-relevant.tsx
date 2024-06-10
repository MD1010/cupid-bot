import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import { MAX_RETRIES, STORAGE_KEYS } from "~consts";
import { sendMessagesToRelevant } from "~services/matches";

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [foundMatches] = useStorage(STORAGE_KEYS.foundMatches);
  const [totalMatchesSent, setTotalMatchesSent] = useState<number>(0);
  const message =
    "האמת שהתלבטתי קצת מה לשלוח לך, ובסוף החלטתי ללכת עם האינטואיציה שלי שאת תעריכי הודעה אותנטית וישירה, ואומר שפשוט התחשק לי להכיר אותך 😊";

  return (
    <>
      <button
        className="plasmo-bg-red-600 plasmo-w-[200px] "
        disabled={isSendingInProgress}
        onClick={async () => {
          for (let i = 0; i < MAX_RETRIES; i++) {
            setIsSendingInProgress(true);
            const newMatchesSent = await sendMessagesToRelevant({
              passIfNotSpecified: false,
              messageToSend: message,
              filters: {
                isNotSemitrailer: true,
                heightRange: { from: 155, to: 170 },
                isWeed: false,
                isSmoking: false,
                // languages: ["russian"]
              },
            });
            setTotalMatchesSent((prevCount) => prevCount + newMatchesSent);
            setIsSendingInProgress(false);
          }
        }}
      >
        {!isSendingInProgress ? (
          "Send to relevant"
        ) : (
          <div>
            <div>Working on that, soon you will go on a date :)</div>
            {foundMatches && <div>Found {foundMatches} new matches</div>}
          </div>
        )}
      </button>

      {totalMatchesSent && <div className='plasmo-text-blue-600'>Total sent: {totalMatchesSent}</div>}
    </>
  );
};
