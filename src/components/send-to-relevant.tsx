import { MAX_RETRIES, STORAGE_KEYS } from "@/consts";
import { sendMessagesToRelevant } from "@/services/matches";
import { sendMessageToTargetId } from "@/services/messages";
import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// import { Button } from "@/components/ui/button"

export const SendToRelevant = () => {
  const [isSendingInProgress, setIsSendingInProgress] = useState(false);
  const [foundMatches] = useStorage(STORAGE_KEYS.foundMatches);

  const message =
    "האמת שהתלבטתי קצת מה לשלוח לך, ובסוף החלטתי ללכת עם האינטואיציה שלי שאת תעריכי הודעה אותנטית וישירה, ואומר שפשוט התחשק לי להכיר אותך 😊";
  const message2 =
    "עכשיו עוד משהו אני די בטוח שזה הדרך הכי יצירתית שאי פעם קיבלת הודעה ממישהו באפליקציה - יש לי הסבר מעניין. תעצרי שנייה ותבדקי מי שלח לך שתי הודעות ראשונות ברצף - מניח שאין כזה :)";

  const sendToSpecificId = async () => {
    setIsSendingInProgress(true);
    await sendMessageToTargetId("11090308773670736355", message2);
    setIsSendingInProgress(false);
  };

  return (
    <>
      <Button
        variant="default"
        isLoading={isSendingInProgress}
        onClick={async () => {
          for (let i = 0; i < MAX_RETRIES; i++) {
            setIsSendingInProgress(true);
            await sendMessagesToRelevant({
              passIfNotSpecified: false,
              messageToSend: message,
              filters: {
                isNotSemitrailer: true,
                heightRange: { from: 153, to: 172 },
                isWeed: false,
                isSmoking: false,
                isReligious: false,
                maxDistance: 37,
                filterIfHasWords: [
                  "Vegan",
                  "יין",
                  "Drinks often",
                  "Bisexual",
                  "Gluten",
                ],
                // todo check why white does not work
              },
            });
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
