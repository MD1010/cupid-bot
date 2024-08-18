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
      "x-okcupid-locale": "en",
      "x-okcupid-device-id": "b2ecd7a9a08ccb9b",
      "Tracestate":"userid=790828667968987270",
      "Traceparent":"00-b84a8a814a48e9732c46fe068ead701a-70621fba7b028351-00"
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
