import { fetchCupidAPI } from "~utils/cupidRequest";
import { getCurrentUserId } from "./user";
import { QUERIES } from "~consts";

const getRemainingLikes = async () => {
  const currentUserId = await getCurrentUserId();
  

  const data = await fetchCupidAPI({
    data: {
      query: QUERIES.getUserLikes,
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

  const likeCap = data.data.user.likesCap.likesRemaining;
  return likeCap;
};

export { getRemainingLikes };
