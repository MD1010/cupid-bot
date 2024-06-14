import { fetchCupidAPI } from "@/utils/cupidRequest";
import { QUERIES } from "../consts";

const getCurrentUserId = async () => {
  try {
    let { data } = await fetchCupidAPI({
      data: {
        operationName: "WebGetUserGuide",
        variables: { userGuide: "SMS_MIGRATION_MODAL" },
        query: QUERIES.getUserGuide,
      },
    });
    return data.me.id;
  } catch (e) {
    console.error(e);
  }
};

export { getCurrentUserId };
