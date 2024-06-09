import _ from "lodash";
import { getRemainingLikes, sendUserPass } from "~api/likes";
import { MAX_RETRIES, SLEEP_TIME_BETWEEN_SENDS, STORAGE_KEYS } from "~consts";
import { storage } from "~storage";
import type { CupidFilters, Match } from "~types";
import { sleep } from "~utils/time";
import { getUserInfo } from "./user";
import { getRelevantMatchesByFilters } from "./filters";
import { sendMessage } from '~api/message';

const STACKS_TO_IGNORE = ["PENPAL"];

export const getUserPotentialMatches = async (
  maxPotentialMatchesToFetch: number
) => {
  const userToStreamMap = new Map<string, string>();
  console.log("getting potential matches...");

  const foundMatches: Match[] = [];
  const info = await getUserInfo();

  const allStacks = info.data.user.stacks;

  console.log('all stacks', allStacks);
  

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
  userToStreamMap: Map<string, string>,
  filters: CupidFilters
) => {
  const passed = getRelevantMatchesByFilters(matches, filters);
  const notPassed = _.difference(matches, passed);
  console.log("passed", passed);
  console.log("not passed", notPassed);

  for (const match of notPassed) {
    console.log("sending pass on ", match.user.id)
    // await sendUserPass(match.user.id, userToStreamMap.get(match.user.id));
    console.log("sleeping on user pass..");
    await sleep(SLEEP_TIME_BETWEEN_SENDS);
  }

  return passed;
};

export const sendMessagesToRelevant = async (
  messageToSend: string,
  maxSendTo?: number,
  filters?: CupidFilters
) => {
  await storage.setItem(STORAGE_KEYS.sentAmount, 0);
  let maxPotentialMatchesToFetch = maxSendTo
    ? maxSendTo
    : await getRemainingLikes();

  let fetchRetries = MAX_RETRIES;
  const sentIds = new Set();

  while (maxPotentialMatchesToFetch > 0 && fetchRetries > 0) {
    fetchRetries -= 1;
    const { foundMatches, userToStreamMap } = await getUserPotentialMatches(
      maxPotentialMatchesToFetch
    );
    const filteredMatches = await filterMatches(
      foundMatches,
      userToStreamMap,
      filters
    );

    console.log("filteredMatches", filteredMatches);

    if (!filterMatches.length) continue;

    for (const { user } of filteredMatches) {
      if (!sentIds.has(user.id)) {
        console.log(`sending message to ${user.id}`);
        const prevAmountSent = await storage.getItem(STORAGE_KEYS.sentAmount);
        // await sendMessage(user.id, messageToSend);
        await storage.setItem(STORAGE_KEYS.sentAmount, prevAmountSent + 1);
        console.log("sleeping...");
        await sleep(SLEEP_TIME_BETWEEN_SENDS);
        sentIds.add(user.id);
      }
    }

    maxPotentialMatchesToFetch -= sentIds.size;
  }
  console.log("done sent to: ", sentIds);
};
