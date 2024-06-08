import { getUserInfo } from "~services/user";

const getRemainingLikes = async () => {
  const data = await getUserInfo();
  const likeCap = data.data.user.likesCap.likesRemaining;
  return likeCap;
};

export { getRemainingLikes };
