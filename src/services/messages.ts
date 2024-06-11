import { sendMessage } from "~api/message";

export const sendMessageToTargetId = async (
  targetId: string,
  message: string
) => {
  await sendMessage(targetId, message);
  console.log(`Message sent to ${targetId}`);
};
