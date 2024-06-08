import _, { uniqueId } from "lodash";
import { getUserInfo } from "./user";
import type { CupidUser } from "~types";
import { storage } from "~storage";
import { MAX_LIKES_PER_DAY, STORAGE_KEYS } from "~consts";
import { sendMessage } from "~api/message";
import { randomUUID } from "crypto";

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

const getFilteredMatches = (data: CupidUser[]) => {
  return data;
};

export const sendMessagesToRelevant = async (messageToSend: string) => {
  let maxPotentialMatchesToFetch = +(await storage.get(STORAGE_KEYS.likes));
  // let maxPotentialMatchesToFetch = 2;
  const alreadySentIds: string[] = JSON.parse(
    await storage.get(STORAGE_KEYS.sentUserIds)
  );

  const sentUserIds = alreadySentIds.length
    ? new Set(alreadySentIds)
    : new Set();

  while (maxPotentialMatchesToFetch > 0) {
    const allUsers = await getUserPotentialMatches(maxPotentialMatchesToFetch);
    const filteredUsers = getFilteredMatches(allUsers);

    console.log("filteredUsers", filteredUsers);

    for (const user of filteredUsers) {
      if (!sentUserIds.has(user.id)) {
        console.log("sending...");
        await sendMessage(user.id, messageToSend);
        sentUserIds.add(user.id);
      }
    }

    maxPotentialMatchesToFetch -= sentUserIds.size;
  }
  console.log("done - sent to:", sentUserIds);
};
