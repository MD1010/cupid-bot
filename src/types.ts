export interface UserInfoResponse {
  data: Data;
  extensions: Extensions;
}
interface Extensions {}

interface Data {
  user: UserInfo;
}
interface UserInfo {
  id: string;
  hasSeenUserGuides: boolean[];
  hasSeenSwipeyOnboarding: boolean;
  hasSeenTappyOnboarding: boolean;
  likesCap: LikesCap;
  __typename: string;
  stacks: Stack[];
}
interface Stack {
  id: string;
  status: string;
  votesRemaining?: number;
  expireTime?: any;
  data: StreamMatch[];
  __typename: string;
}
interface StreamMatch {
  stream: string;
  match: Match;
  __typename: string;
}
interface Match {
  senderLikes: boolean;
  senderPassed: boolean;
  firstMessage?: any;
  __typename: string;
  matchPercent: number;
  targetLikes: boolean;
  targetMessageTime?: any;
  targetLikeViaSpotlight: boolean;
  user: CupidUser;
}

export interface CupidUser {
  id: string;
  displayname: string;
  username: string;
  age: number;
  primaryImage: PrimaryImage;
  location: Location;
  photos: PrimaryImage[];
  essaysWithUniqueIds: EssaysWithUniqueId[];
  detailSentences: DetailSentence[];
  __typename: string;
}
interface Match {
  senderLikes: boolean;
  senderPassed: boolean;
  firstMessage?: any;
  __typename: string;
  matchPercent: number;
  targetLikes: boolean;
  targetMessageTime?: any;
  targetLikeViaSpotlight: boolean;
  user: CupidUser;
}

interface DetailSentence {
  name: string;
  text: string;
  __typename: string;
}
interface EssaysWithUniqueId {
  id: string;
  title: string;
  processedContent: string;
  __typename: string;
}
interface Location {
  summary: string;
  __typename: string;
}
interface PrimaryImage {
  id: string;
  square100: string;
  square120: string;
  square225: string;
  square400: string;
  __typename: string;
}
interface LikesCap {
  likesRemaining: number;
  resetTime: number;
  viewCount: number;
  __typename: string;
}

type DateStyle = "hookups" | "long" | "short" | "friends";
type BodyStyle =
  | "all"
  | "thin"
  | "fit"
  | "average"
  | "jacked"
  | "curvy"
  | "full figured"
  | "a little extra"
  | "overweight";

type NumericRange = { from: number; to: number };

export interface CupidFilter {
  dateStyle?: DateStyle;
  bodyStyle?: BodyStyle;
  isStraight?: boolean;
  isMonogamy?: boolean;
  heightRange?: NumericRange;
  filterIfHasWords?: string[];
  onlyAcceptIfIncludeWords?: string[];
  isReligious?: boolean;
  isSmoking?: boolean;
  isWeed?: boolean;
  isDrinking?: boolean;
  languages?: string[];
  isJewish?: boolean;
}
