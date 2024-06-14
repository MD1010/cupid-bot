import { CUPID_BASE_GQL_URL, DEFAULT_MESSAGE, QUERIES, STORAGE_KEYS } from '@/consts';
import { storage } from '@/storage';
import { fetchCupidAPI } from '@/utils/cupidRequest';


export const sendMessage = async (
  userId: string,
  message: string = DEFAULT_MESSAGE
) => {
  try {
    const likesLeft = +(await storage.get(STORAGE_KEYS.likes));

    if (!likesLeft) return;
    await fetchCupidAPI({
      url: `${CUPID_BASE_GQL_URL}?operationName=WebConversationMessageSend`,
      data: {
        operationName: "WebConversationMessageSend",
        query: QUERIES.sendMessage,
        variables: {
          input: {
            targetId: userId,
            text: message,
            source: "desktop_global",
          },
        },
      },
    });
    await storage.set(STORAGE_KEYS.likes, likesLeft - 1);
  } catch (e) {
    console.error(e);
  }
};
