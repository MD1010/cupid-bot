import _, { uniqueId } from "lodash";
import { getUserInfo } from "./user";
import type { CupidFilter, CupidUser } from "~types";
import { storage } from "~storage";
import {
  MAX_LIKES_PER_DAY,
  SLEEP_TIME_BETWEEN_SENDS,
  STORAGE_KEYS,
} from "~consts";
import { sendMessage } from "~api/message";
import { randomUUID } from "crypto";
import { userInfo } from "os";
import { getRemainingLikes } from "~api/likes";
import { sleep } from "~utils/time";

const STACKS_TO_IGNORE = ["PENPAL"];

export const getUserPotentialMatches = async (
  maxPotentialMatchesToFetch: number
) => {
  console.log("getting potential matches...");

  const foundUsers: CupidUser[] = [];
  const info = await getUserInfo();

  const allStacks = info.data.user.stacks;

  for (const stack of allStacks) {
    if (STACKS_TO_IGNORE.includes(stack.id)) continue;

    const potentialMatches = stack.data;
    for (const potentialMatch of potentialMatches) {
      if (
        potentialMatch.match?.user &&
        foundUsers.length < maxPotentialMatchesToFetch
      ) {
        foundUsers.push(potentialMatch.match.user);
      }
    }
  }
  return _.uniqBy(foundUsers, (user) => user.id);
};

const getFilteredMatches = (data: CupidUser[], filters: CupidFilter[]) => {
  return data;
};

export const sendMessagesToRelevant = async (
  messageToSend: string,
  maxSendTo?: number,
  filters: CupidFilter[] = []
) => {
  let maxPotentialMatchesToFetch = maxSendTo
    ? maxSendTo
    : await getRemainingLikes();
  const sentIds = new Set();
  await storage.setItem(STORAGE_KEYS.sentAmount, 0);

  while (maxPotentialMatchesToFetch > 0) {
    const allUsers = await getUserPotentialMatches(maxPotentialMatchesToFetch);
    const filteredUsers = getFilteredMatches(allUsers, filters);

    console.log("filteredUsers", filteredUsers);

    for (const user of filteredUsers) {
      if (!sentIds.has(user.id)) {
        console.log("sending...");
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
