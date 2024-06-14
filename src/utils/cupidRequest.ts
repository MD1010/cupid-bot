import { CUPID_BASE_GQL_URL } from '@/consts';
import _ from "lodash";



type CupidGQLBody = {
  operationName: "WebGetUserGuide" | "WebStacksMenu" | "WebConversationMessageSend" | "WebUserVote";
  variables: {};
  query: string;
};

type FetchRequest = {
  method?: "POST";
  url?: string;
  data?: CupidGQLBody;
};

export const fetchCupidAPI = async ({
  method = "POST",
  url = CUPID_BASE_GQL_URL,
  data,
}: FetchRequest) => {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "x-okcupid-platform": "DESKTOP",
      "x-okcupid-version": "1",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
