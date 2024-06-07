import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const config: PlasmoCSConfig = {
  matches: ["https://www.okcupid.com/*"],
  all_frames: true
}

// src/content.ts
console.log("Content script loaded on", window.location.href)

// Function to inject a button into the page
const injectButton = () => {
  const button = document.createElement("button")
  button.textContent = "Click Me"
  button.style.position = "fixed"
  button.style.bottom = "10px"
  button.style.right = "10px"
  button.style.zIndex = "1000"
  button.onclick = () => alert("Button clicked!")
  document.body.appendChild(button)
}

const ensureContentLoaded = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectButton)
  } else {
    injectButton()
  }
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "x-okcupid-platform": "DESKTOP",
      "x-okcupid-version": "1"
    },
    body: JSON.stringify(data)
  })
  return await response.json()
}

async function getSelfId() {
  const send = {
    operationName: "WebGetUserGuide",
    variables: { userGuide: "SMS_MIGRATION_MODAL" },
    query:
      "query WebGetUserGuide($userGuide: UserGuide!) {\n  me {\n    id\n    hasSeenUserGuide(feature: $userGuide)\n    __typename\n  }\n}\n"
  }
  let user_self_id = await postData(
    "https://www.okcupid.com/graphql",
    send
  ).then((data) => {
    return data.data.me.id
  })
  return user_self_id
}

async function getRemainingLikes() {
  const postUrl = "https://www.okcupid.com/graphql"
  const self_id = await getSelfId()
  const requestData = {
    operationName: "WebStacksMenu",
    variables: {
      id: self_id,
      userGuides: [
        "STACK_JUST_FOR_YOU",
        "STACK_NEARBY",
        "STACK_POPULAR",
        "STACK_MOST_QUESTIONS",
        "STACK_ONLINE_NOW",
        "STACK_NEW_USERS",
        "STACK_MATCH_PERCENTAGE",
        "STACK_PROMOTED_QUESTION"
      ]
    },
    query:
      "fragment PhotoFragment on Photo {\n  square100\n  square120\n  square225\n  square400\n  __typename\n}\n\nfragment FirstMessage on Match {\n  senderLikes\n  senderPassed\n  firstMessage {\n    id\n    threadId\n    text\n    profileComment {\n      ... on ProfileCommentPhoto {\n        photo {\n          square800\n          __typename\n        }\n        __typename\n      }\n      ... on ProfileCommentEssay {\n        essayTitle\n        essayText\n        __typename\n      }\n      ... on ProfileCommentInstagramPhoto {\n        instagramPhoto {\n          square640\n          __typename\n        }\n        __typename\n      }\n      ... on ProfileCommentQuestion {\n        questionText\n        targetAnswer\n        targetExplanation\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment StackUserFragment on StackMatch {\n  stream\n  match {\n    ...FirstMessage\n    matchPercent\n    targetLikes\n    senderLikes\n    targetMessageTime\n    targetLikeViaSpotlight\n    user {\n      id\n      displayname\n      username\n      age\n      primaryImage {\n        id\n        ...PhotoFragment\n        __typename\n      }\n      location {\n        summary\n        __typename\n      }\n      photos {\n        id\n        ...PhotoFragment\n        __typename\n      }\n      essaysWithUniqueIds {\n        id\n        title\n        processedContent\n        __typename\n      }\n      detailSentences {\n        name\n        text\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PromotedQuestionPromptFragment on PromotedQuestionPrompt {\n  questionId\n  __typename\n}\n\nfragment LikesCapFragment on User {\n  likesCap {\n    likesRemaining\n    resetTime\n    viewCount\n    __typename\n  }\n  __typename\n}\n\nquery WebStacksMenu($id: String!, $userGuides: [UserGuide!]!) {\n  user(id: $id) {\n    id\n    hasSeenUserGuides(features: $userGuides)\n    hasSeenSwipeyOnboarding: hasSeenUserGuide(feature: MW_ONBOARDING_QM_SWIPEY)\n    hasSeenTappyOnboarding: hasSeenUserGuide(feature: MW_ONBOARDING_QM_TAPPY)\n    ...LikesCapFragment\n    stacks {\n      id\n      status\n      votesRemaining\n      expireTime\n      data {\n        ...StackUserFragment\n        ...PromotedQuestionPromptFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
  }

  const data = await postData(postUrl, requestData)

  const likeCap = data.data.user.likesCap.likesRemaining
  const likesDiv = document.createElement("div")
  likesDiv.textContent = likeCap

  likesDiv.style.position = "fixed"
  likesDiv.style.bottom = "10px"
  likesDiv.style.right = "150px"
  likesDiv.style.zIndex = "1000"
  document.body.appendChild(likesDiv)

  console.log("success likes =>", likeCap)
  // chrome.storage.sync.set({
  //   badge: likeCap
  // })

  await storage.set("likes", likeCap)
  // chrome.runtime.sendMessage({ type: "LIKES_UPDATE", likes: likeCap })
}

ensureContentLoaded()
getRemainingLikes()
