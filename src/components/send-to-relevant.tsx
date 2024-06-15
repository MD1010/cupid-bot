import { MAX_RETRIES, STORAGE_KEYS } from "@/consts";
import { sendMessagesToRelevant } from "@/services/matches";
import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import { Button } from "./ui/button";

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [foundMatches] = useStorage(STORAGE_KEYS.foundMatches);
  const [filters] = useStorage(STORAGE_KEYS.filters);

  // const message2 =
  //   "עכשיו עוד משהו אני די בטוח שזה הדרך הכי יצירתית שאי פעם קיבלת הודעה ממישהו באפליקציה - יש לי הסבר מעניין. תעצרי שנייה ותבדקי מי שלח לך שתי הודעות ראשונות ברצף - מניח שאין כזה :)";

  // const sendToSpecificId = async () => {
  //   setIsSendingInProgress(true);
  //   await sendMessageToTargetId("11090308773670736355", message2);
  //   setIsSendingInProgress(false);
  // };

  return (
    <>
      <Button
        variant="default"
        isLoading={isSendingInProgress}
        onClick={async () => {
          for (let i = 0; i < MAX_RETRIES; i++) {
            setIsSendingInProgress(true);
            await sendMessagesToRelevant(filters);
            setIsSendingInProgress(false);
          }
        }}
      >
        {isSendingInProgress ? (
          foundMatches ? (
            <div>Found {foundMatches} new matches</div>
          ) : (
            `Working on that :)`
          )
        ) : (
          "Match"
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
