import { getRemainingLikes, sendUserPass } from "@/api/likes";
import { SLEEP_TIME_BETWEEN_SENDS, STORAGE_KEYS } from "@/consts";
import { checkIfSentIdExists, saveSentId } from '@/lib/db';
import { storage } from "@/storage";
import type { CupidFilters, Match } from "@/types";
import { sleep } from "@/utils/time";
import _ from "lodash";
import { getRelevantMatchesByFilters } from "./filters";
import { getUserInfo } from "./user";
import { sendMessage } from '@/api/message';

const STACKS_TO_IGNORE = ["PENPAL"];

export const getUserPotentialMatches = async (
  maxPotentialMatchesToFetch: number
) => {
  const userToStreamMap = new Map<string, string>();
  console.log("getting potential matches...");

  const foundMatches: Match[] = [];
  const info = await getUserInfo();

  const allStacks = info.data.user.stacks;

  for (const stack of allStacks) {
    if (STACKS_TO_IGNORE.includes(stack.id)) continue;

    const potentialMatches = stack.data;
    for (const potentialMatch of potentialMatches) {
      if (
        potentialMatch.match?.user &&
        foundMatches.length < maxPotentialMatchesToFetch
      ) {
        foundMatches.push(potentialMatch.match);
        userToStreamMap.set(
          potentialMatch.match.user.id,
          potentialMatch.stream
        );
      }
    }
  }

  return {
    foundMatches: _.uniqBy(foundMatches, (match) => match.user.id),
    userToStreamMap,
  };
};

const filterMatches = async (
  matches: Match[],
  filters: CupidFilters,
  ignoreIfNotSpcified: boolean
) => {
  const { foundMatches: passed, reasons } = await getRelevantMatchesByFilters(
    matches,
    filters,
    ignoreIfNotSpcified
  );
  const passedMap = new Map();
  for (const passedMatch of passed) {
    passedMap.set(passedMatch.user.id, passedMatch);
  }

  return { passedMap, reasons };
};

export const sendMessagesToRelevant = async ({
  messageToSend,
  maxSendTo,
  filters,
  passIfNotSpecified = false,
}: {
  messageToSend: string;
  maxSendTo?: number;
  filters?: CupidFilters;
  passIfNotSpecified?: boolean;
}) => {
  await storage.setItem(STORAGE_KEYS.foundMatches, 0);
  await storage.setItem(STORAGE_KEYS.sentAmount, 0);

  let maxPotentialMatchesToFetch = maxSendTo
    ? maxSendTo
    : await getRemainingLikes();

  let numOfSent = 0;

  const { foundMatches, userToStreamMap } = await getUserPotentialMatches(
    maxPotentialMatchesToFetch
  );

  console.log("found matches");

  const { passedMap: passedMatches, reasons } = await filterMatches(
    foundMatches,
    filters,
    passIfNotSpecified
  );

  console.log("passed ", passedMatches);

  if (!passedMatches.size) return;

  await storage.setItem(STORAGE_KEYS.foundMatches, passedMatches.size);
  await storage.setItem(STORAGE_KEYS.sentAmount, 0);

  for (const { user } of foundMatches) {
   
    const idSent = await checkIfSentIdExists(user.id);
    if (idSent) continue;
    if (passedMatches.get(user.id)) {
      console.log(
        `id: ${user.id} 
        ✅ name: ${user.displayname},
        from: ${user.location.summary},
        age: ${user.age},
        photos:\n${user.photos.map((photo) => photo.square400).join("\n")}`,
      );
      await sendMessage(user.id, messageToSend);
      numOfSent += 1;
      await saveSentId(user.id);
      await storage.setItem(STORAGE_KEYS.sentAmount, numOfSent);
    } else {
      console.log(
        "❌",
        `photos:\n${user.photos.map((photo) => photo.square400).join("\n")}`,
        `id: ${user.id}`,
        `reasons: ${reasons[user.id]}`,
      );
      await sendUserPass(user.id, userToStreamMap.get(user.id));
    }
    console.log("💤");

    await sleep(SLEEP_TIME_BETWEEN_SENDS);
  }
  console.log(`DONE sent to ${numOfSent} new matches`);
  return numOfSent;
};
