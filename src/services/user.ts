import { getCurrentUserId } from "~api/user";
import { QUERIES, STORAGE_KEYS } from "~consts";
import { storage } from "~storage";
import type { UserInfoResponse } from "~types";
import { fetchCupidAPI } from "~utils/cupidRequest";

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const currentUserId = await storage.get(STORAGE_KEYS.currentUserId);
  const data = await fetchCupidAPI({
    data: {
      query: QUERIES.getUserInfo,
      operationName: "WebStacksMenu",
      variables: {
        id: currentUserId,
        userGuides: [
          "STACK_JUST_FOR_YOU",
          "STACK_NEARBY",
          "STACK_POPULAR",
          "STACK_MOST_QUESTIONS",
          "STACK_ONLINE_NOW",
          "STACK_NEW_USERS",
          "STACK_MATCH_PERCENTAGE",
          "STACK_PROMOTED_QUESTION",
        ],
      },
    },
  });
  return data;
};

export const setCurrentUserId = async () => {
  const currentUserId = await getCurrentUserId();
  storage.set(STORAGE_KEYS.currentUserId, currentUserId);
};
