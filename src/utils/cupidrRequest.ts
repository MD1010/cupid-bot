import _ from "lodash";
import { CUPID_BASE_GQL_URL } from '~consts';


type CupidGQLBody = {
  operationName: "WebGetUserGuide" | "WebStacksMenu";
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
