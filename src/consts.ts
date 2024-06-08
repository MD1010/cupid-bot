export const CUPID_BASE_GQL_URL = "https://www.okcupid.com/graphql";

export const QUERIES = {
  getUserGuide:
    "query WebGetUserGuide($userGuide: UserGuide!) {\n  me {\n    id\n    hasSeenUserGuide(feature: $userGuide)\n    __typename\n  }\n}\n",
  getUserInfo:
    "fragment PhotoFragment on Photo {\n  square100\n  square120\n  square225\n  square400\n  __typename\n}\n\nfragment FirstMessage on Match {\n  senderLikes\n  senderPassed\n  firstMessage {\n    id\n    threadId\n    text\n    profileComment {\n      ... on ProfileCommentPhoto {\n        photo {\n          square800\n          __typename\n        }\n        __typename\n      }\n      ... on ProfileCommentEssay {\n        essayTitle\n        essayText\n        __typename\n      }\n      ... on ProfileCommentInstagramPhoto {\n        instagramPhoto {\n          square640\n          __typename\n        }\n        __typename\n      }\n      ... on ProfileCommentQuestion {\n        questionText\n        targetAnswer\n        targetExplanation\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment StackUserFragment on StackMatch {\n  stream\n  match {\n    ...FirstMessage\n    matchPercent\n    targetLikes\n    senderLikes\n    targetMessageTime\n    targetLikeViaSpotlight\n    user {\n      id\n      displayname\n      username\n      age\n      primaryImage {\n        id\n        ...PhotoFragment\n        __typename\n      }\n      location {\n        summary\n        __typename\n      }\n      photos {\n        id\n        ...PhotoFragment\n        __typename\n      }\n      essaysWithUniqueIds {\n        id\n        title\n        processedContent\n        __typename\n      }\n      detailSentences {\n        name\n        text\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PromotedQuestionPromptFragment on PromotedQuestionPrompt {\n  questionId\n  __typename\n}\n\nfragment LikesCapFragment on User {\n  likesCap {\n    likesRemaining\n    resetTime\n    viewCount\n    __typename\n  }\n  __typename\n}\n\nquery WebStacksMenu($id: String!, $userGuides: [UserGuide!]!) {\n  user(id: $id) {\n    id\n    hasSeenUserGuides(features: $userGuides)\n    hasSeenSwipeyOnboarding: hasSeenUserGuide(feature: MW_ONBOARDING_QM_SWIPEY)\n    hasSeenTappyOnboarding: hasSeenUserGuide(feature: MW_ONBOARDING_QM_TAPPY)\n    ...LikesCapFragment\n    stacks {\n      id\n      status\n      votesRemaining\n      expireTime\n      data {\n        ...StackUserFragment\n        ...PromotedQuestionPromptFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
  sendMessage:
    "mutation WebConversationMessageSend($input: ConversationMessageSendInput!) {\n  conversationMessageSend(input: $input) {\n    success\n    messageId\n    nway\n    threadId\n    errorCode\n    __typename\n  }\n}",
};

export const OPERATIONS = {
  getUserGuide: "WebGetUserGuide",
};

export const STORAGE_KEYS = {
  likes: "likes",
  currentUserId: "currentUserId",
  sentAmount: "sentAmount",
};

export const DEFAULT_MESSAGE = "היי :)";
export const MAX_LIKES_PER_DAY = 3;
export const SLEEP_TIME_BETWEEN_SENDS = 2_000