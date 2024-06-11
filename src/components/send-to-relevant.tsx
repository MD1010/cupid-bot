import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import { MAX_RETRIES, STORAGE_KEYS } from "~consts";
import { sendMessagesToRelevant } from "~services/matches";
import { sendMessageToTargetId } from "~services/messages";

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [foundMatches] = useStorage(STORAGE_KEYS.foundMatches);
  const [sentAmount] = useStorage(STORAGE_KEYS.sentAmount);
  const [totalMatchesSent, setTotalMatchesSent] = useState<number>(0);
  const message =
    "האמת שהתלבטתי קצת מה לשלוח לך, ובסוף החלטתי ללכת עם האינטואיציה שלי שאת תעריכי הודעה אותנטית וישירה, ואומר שפשוט התחשק לי להכיר אותך 😊";
  const message2 =
    "עכשיו עוד משהו אני די בטוח שזה הדרך הכי יצירתית שאי פעם קיבלת הודעה ממישהו באפליקציה - יש לי הסבר מעניין. תעצרי שנייה ותבדקי מי שלח לך שתי הודעות ראשונות ברצף - מניח שאין כזה :)";

  useEffect(() => {
    sentAmount && setTotalMatchesSent((prevCount) => (prevCount += 1));
  }, [sentAmount]);

  const sendToSpecificId = async () => {
    setIsSendingInProgress(true);
    await sendMessageToTargetId("3770604814292073573", "");
    setIsSendingInProgress(false);
  };

  return (
    <>
      <button
        className="plasmo-bg-red-600 plasmo-w-[200px] "
        disabled={isSendingInProgress}
        onClick={async () => {
          for (let i = 0; i < MAX_RETRIES; i++) {
            setIsSendingInProgress(true);
            await sendMessagesToRelevant({
              passIfNotSpecified: true,
              messageToSend: message,
              filters: {
                isNotSemitrailer: true,
                heightRange: { from: 155, to: 172 },
                isWeed: false,
                isSmoking: false,
                isReligious: false,
              },
            });

            setIsSendingInProgress(false);
          }
        }}
      >
        {!isSendingInProgress ? (
          "Send to relevant"
        ) : (
          <div>
            <div>Working on that :)</div>
            {foundMatches && <div>Found {foundMatches} new matches</div>}
          </div>
        )}
      </button>

      {/* <button
        className="plasmo-bg-red-600 plasmo-w-[200px] plasmo-mx-10"
        disabled={isSendingInProgress}
        onClick={sendToSpecificId}
      >
        Send to specific one
      </button> */}

      <div className="plasmo-text-blue-600">Total sent: {totalMatchesSent}</div>
    </>
  );
};
