import { CUPID_BASE_GQL_URL, QUERIES } from "@/consts";
import { getUserInfo } from "@/services/user";
import { fetchCupidAPI } from "@/utils/cupidRequest";

const getRemainingLikes = async () => {
  const data = await getUserInfo();
  const likeCap = data.data.user.likesCap.likesRemaining;
  console.log("like cap", likeCap);
  
  return likeCap;
};

const sendUserPass = async (userId: string, streamId: string) => {
  console.log(`passing on user ${userId}`);
  await fetchCupidAPI({
    url: `${CUPID_BASE_GQL_URL}?operationName=WebUserVote`,
    data: {
      query: QUERIES.passUser,
      operationName: "WebUserVote",
      variables: {
        input: {
          votes: [
            {
              targetId: userId,
              vote: "PASS",
              voteSource: "DOUBLETAKE",
              userMetadata: streamId,
              comment: null,
            },
          ],
        },
      },
    },
  });
};

export { getRemainingLikes, sendUserPass };
