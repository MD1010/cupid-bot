import {
  EMPLOYED_STATUSES,
  FAT_BODY_TYPES,
  RELIGIOUS_RESERVED_WORDS
} from "~consts";
import type {
  CupidFilters,
  CupidUser,
  Match,
  NumericRange
} from "~types";
import { getDetail, getHeight, hasWords } from "~utils/filters";

function filterByOrientation(
  user: CupidUser,
  isStraight: boolean,
  passIfNotSpecified: boolean
): boolean {
  const orientation = getDetail(user.detailSentences, "basics");
  if (passIfNotSpecified && !orientation) return true;
  return orientation.includes("Straight") === isStraight;
}

function filterByMonogamy(
  user: CupidUser,
  isMonogamy: boolean,
  passIfNotSpecified: boolean
): boolean {
  const monogamy = getDetail(user.detailSentences, "basics");
  if (passIfNotSpecified && !monogamy) return true;
  return monogamy.includes("Monogamous") === isMonogamy;
}

function filterByHeight(
  user: CupidUser,
  heightRange: NumericRange,
): boolean {
  const height = getHeight(user.detailSentences);
  if (!height) return true;
  return (
    !height ||
    (height && height >= heightRange.from && height <= heightRange.to)
  );
}

function filterByExcludeWords(
  user: CupidUser,
  excludeWords: string[]
): boolean {
  const basics = getDetail(user.detailSentences, "basics") || "";
  const looks = getDetail(user.detailSentences, "looks") || "";
  const background = getDetail(user.detailSentences, "background") || "";
  const lifestyle = getDetail(user.detailSentences, "lifestyle") || "";
  const family = getDetail(user.detailSentences, "family") || "";

  const allText = [
    basics,
    looks,
    background,
    lifestyle,
    family,
    ...user.essaysWithUniqueIds.map((essay) => essay.processedContent),
  ].join(" ");

  return !hasWords(allText, excludeWords);
}

function filterByIncludeWords(
  user: CupidUser,
  includeWords: string[]
): boolean {
  const basics = getDetail(user.detailSentences, "basics") || "";
  const looks = getDetail(user.detailSentences, "looks") || "";
  const background = getDetail(user.detailSentences, "background") || "";
  const lifestyle = getDetail(user.detailSentences, "lifestyle") || "";
  const family = getDetail(user.detailSentences, "family") || "";

  const allText = [
    basics,
    looks,
    background,
    lifestyle,
    family,
    ...user.essaysWithUniqueIds.map((essay) => essay.processedContent),
  ].join(" ");

  return hasWords(allText, includeWords);
}

function filterByReligion(
  user: CupidUser,
  isReligious: boolean,
  passIfNotSpecified: boolean
): boolean {
  const religion = getDetail(user.detailSentences, "background");

  if (passIfNotSpecified && !religion) return true;
  return (
    (isReligious && filterByIncludeWords(user, RELIGIOUS_RESERVED_WORDS)) ||
    (!isReligious && filterByExcludeWords(user, RELIGIOUS_RESERVED_WORDS))
  );
}

function filterBySmoking(
  user: CupidUser,
  isSmoking: boolean,
  passIfNotSpecified: boolean
): boolean {
  const smoking = getDetail(user.detailSentences, "lifestyle");
  if (passIfNotSpecified && !smoking) return true;
  return (
    (smoking?.includes("Smokes cigarettes") && isSmoking) ||
    (smoking?.includes("Doesn't smoke") && !isSmoking)
  );
}

function filterByWeed(
  user: CupidUser,
  isWeed: boolean,
  passIfNotSpecified: boolean
): boolean {
  const weed = getDetail(user.detailSentences, "lifestyle");
  if (passIfNotSpecified && !weed) return true;
  return (
    (weed?.includes("Smokes marijuana") && isWeed) ||
    (weed?.includes("Never smokes marijuana") && !isWeed)
  );
}

function filterByDrinking(
  user: CupidUser,
  isDrinking: boolean,
  passIfNotSpecified: boolean
): boolean {
  const drinking = getDetail(user.detailSentences, "lifestyle");
  if (passIfNotSpecified && !drinking) return true;
  return (
    (drinking?.includes("Drinks") && isDrinking) ||
    (drinking?.includes("Doesn't drink") && !isDrinking)
  );
}

function filterByLanguages(
  user: CupidUser,
  languages: string[],
  passIfNotSpecified: boolean
): boolean {
  const backgroundDetails = getDetail(user.detailSentences, "background") || "";

  const userLanguages = backgroundDetails
    .split(",") // Split by comma first
    .flatMap((part) =>
      part
        .split(/and|\s+/)
        .map((lang) => lang.trim())
        .filter(Boolean)
    )
    .filter(
      (word) => /^[a-zA-Z]+$/.test(word) || /^[a-zA-Z]+-*[a-zA-Z]*$/.test(word)
    )
    .map((lang) => lang.toLowerCase());

  if (passIfNotSpecified && !userLanguages.length) return true;

  const lowerCaseLanguages = languages.map((lang) => lang.toLowerCase());
  return lowerCaseLanguages.some((lang) => userLanguages.includes(lang));
}
function filterByJewish(
  user: CupidUser,
  isJewish: boolean,
  passIfNotSpecified: boolean
): boolean {
  const religion = getDetail(user.detailSentences, "background");
  if (passIfNotSpecified && !religion) return true;
  return (
    (religion?.includes("Jewish") && isJewish) ||
    (!religion?.includes("Jewish") && !isJewish)
  );
}

function filterByEducationLevel(
  user: CupidUser,
  passIfNotSpecified: boolean
): boolean {
  const education = getDetail(user.detailSentences, "background");
  if (passIfNotSpecified && !education) return true;
  return education?.includes("Graduate degree");
}

function filterByEmployment(
  user: CupidUser,
  passIfNotSpecified: boolean
): boolean {
  const employment = getDetail(user.detailSentences, "background") || "";

  if (passIfNotSpecified && !employment) return true;
  return EMPLOYED_STATUSES.some((status) => employment?.toLowerCase().includes(status.toLowerCase()));
}

function filterByBodyStyle(
  user: CupidUser,
  passIfNotSpecified: boolean
): boolean {
  const looks = getDetail(user.detailSentences, "looks");
  if (passIfNotSpecified && !looks) return true;
  return FAT_BODY_TYPES.every((fatType) => !looks?.toLowerCase().includes(fatType.toLowerCase()));
}

function filterByMinMatchPercentage(
  match: Match,
  minMatchPercentage: number
): boolean {
  return match.matchPercent >= minMatchPercentage;
}

function filterByMutualLike(match: Match): boolean {
  return match.targetLikes;
}

function filterByHasKids(
  user: CupidUser,
  hasKids: boolean,
  passIfNotSpecified: boolean
): boolean {
  const family = getDetail(user.detailSentences, "family");
  if (passIfNotSpecified && !family) return true;

  return (
    (hasKids && family?.includes("Has kid")) ||
    (!hasKids && !family?.includes("Has kid"))
  );
}

export function getRelevantMatchesByFilters(
  matches: Match[],
  filters: CupidFilters,
  passIfNotSpecified: boolean
): Match[] {
  return matches.filter((match) => {
    const user = match.user;

    if (
      filters.isStraight !== undefined &&
      !filterByOrientation(user, filters.isStraight, passIfNotSpecified)
    )
      return false;
    if (
      filters.isMonogamy !== undefined &&
      !filterByMonogamy(user, filters.isMonogamy, passIfNotSpecified)
    )
      return false;
    if (
      filters.heightRange &&
      !filterByHeight(user, filters.heightRange)
    )
      return false;
    if (
      filters.filterIfHasWords &&
      !filterByExcludeWords(user, filters.filterIfHasWords)
    )
      return false;
    if (
      filters.onlyAcceptIfIncludeWords &&
      !filterByIncludeWords(user, filters.onlyAcceptIfIncludeWords)
    )
      return false;
    if (
      filters.isReligious !== undefined &&
      !filterByReligion(user, filters.isReligious, passIfNotSpecified)
    )
      return false;
    if (
      filters.isSmoking !== undefined &&
      !filterBySmoking(user, filters.isSmoking, passIfNotSpecified)
    )
      return false;
    if (
      filters.isWeed !== undefined &&
      !filterByWeed(user, filters.isWeed, passIfNotSpecified)
    )
      return false;
    if (
      filters.isDrinking !== undefined &&
      !filterByDrinking(user, filters.isDrinking, passIfNotSpecified)
    )
      return false;
    if (
      filters.languages &&
      !filterByLanguages(user, filters.languages, passIfNotSpecified)
    )
      return false;
    if (
      filters.isJewish !== undefined &&
      !filterByJewish(user, filters.isJewish, passIfNotSpecified)
    )
      return false;
    if (
      filters.isEducated &&
      !filterByEducationLevel(user, passIfNotSpecified)
    )
      return false;
    if (filters.isEmployed && !filterByEmployment(user, passIfNotSpecified))
      return false;
    if (
      filters.isNotSemitrailer &&
      !filterByBodyStyle(user, passIfNotSpecified)
    )
      return false;
    if (
      filters.minMatchPercentage !== undefined &&
      !filterByMinMatchPercentage(match, filters.minMatchPercentage)
    )
      return false;
    if (filters.isMutualLike !== undefined && !filterByMutualLike(match))
      return false;

    if (
      filters.hasKids !== undefined &&
      !filterByHasKids(match.user, filters.hasKids, passIfNotSpecified)
    )
      return false;
    return true;
  });
}
