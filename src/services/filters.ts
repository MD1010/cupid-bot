import type {
  BodyStyle,
  CupidFilters,
  CupidUser,
  EmploymentType,
  Match,
  NumericRange
} from "~types";
import { getDetail, getHeight, hasWords } from "~utils/filters";

function filterByOrientation(user: CupidUser, isStraight: boolean): boolean {
  const orientation = getDetail(user.detailSentences, "basics");
  return orientation.includes("Straight") === isStraight;
}

function filterByMonogamy(user: CupidUser, isMonogamy: boolean): boolean {
  const monogamy = getDetail(user.detailSentences, "basics");
  return monogamy.includes("Monogamous") === isMonogamy;
}

function filterByHeight(user: CupidUser, heightRange: NumericRange): boolean {
  const height = getHeight(user.detailSentences);
  return !height || height && height >= heightRange.from && height <= heightRange.to;
}

function filterByExcludeWords(
  user: CupidUser,
  excludeWords: string[]
): boolean {
  const allText = user.essaysWithUniqueIds
    .map((essay) => essay.processedContent)
    .join(" ");
  return !hasWords(allText, excludeWords);
}

function filterByIncludeWords(
  user: CupidUser,
  includeWords: string[]
): boolean {
  const allText = user.essaysWithUniqueIds
    .map((essay) => essay.processedContent)
    .join(" ");
  return hasWords(allText, includeWords);
}

function filterByReligion(user: CupidUser, isReligious: boolean): boolean {
  const religion = getDetail(user.detailSentences, "background");
  return (
    (religion.includes("Jewish") && isReligious) ||
    (!religion.includes("Jewish") && !isReligious)
  );
}

function filterBySmoking(user: CupidUser, isSmoking: boolean): boolean {
  const smoking = getDetail(user.detailSentences, "lifestyle");
  return (
    (smoking.includes("Smokes cigarettes") && isSmoking) ||
    (smoking.includes("Doesn't smoke") && !isSmoking)
  );
}

function filterByWeed(user: CupidUser, isWeed: boolean): boolean {
  const weed = getDetail(user.detailSentences, "lifestyle");
  return (
    (weed.includes("Smokes marijuana") && isWeed) ||
    (weed.includes("Never smokes marijuana") && !isWeed)
  );
}

function filterByDrinking(user: CupidUser, isDrinking: boolean): boolean {
  const drinking = getDetail(user.detailSentences, "lifestyle");
  return (
    (drinking.includes("Drinks") && isDrinking) ||
    (drinking.includes("Doesn't drink") && !isDrinking)
  );
}

function filterByLanguages(user: CupidUser, languages: string[]): boolean {
  const userLanguages =
    getDetail(user.detailSentences, "background")
      ?.split(", ")
      .filter((lang) => lang.startsWith("Speaks"))
      .map((lang) => lang.replace("Speaks ", "").toLowerCase()) || [];

  const lowerCaseLanguages = languages.map((lang) => lang.toLowerCase());
  return lowerCaseLanguages.some((lang) => userLanguages.includes(lang));
}

function filterByJewish(user: CupidUser, isJewish: boolean): boolean {
  const religion = getDetail(user.detailSentences, "background");
  return (
    (religion.includes("Jewish") && isJewish) ||
    (!religion.includes("Jewish") && !isJewish)
  );
}

function filterByEducationLevel(
  user: CupidUser,
  educationLevel: string[]
): boolean {
  const education = getDetail(user.detailSentences, "background");
  return educationLevel.some((level) => education.includes(level));
}

function filterByEmploymentStatus(
  user: CupidUser,
  employmentStatus: EmploymentType[]
): boolean {
  const employment = getDetail(user.detailSentences, "background");
  return employmentStatus.some((status) => employment.includes(status));
}

function filterByBodyStyle(user: CupidUser, bodyStyle: BodyStyle): boolean {
  const looks = getDetail(user.detailSentences, "looks");
  if (bodyStyle === "all") return true;
  return (
    looks &&
    looks.toLowerCase().includes(bodyStyle.replace(/ /g, "").toLowerCase())
  );
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

export function getRelevantMatchesByFilters(matches: Match[], filters: CupidFilters): Match[] {
  return matches.filter((match) => {
    const user = match.user;

    if (
      filters.isStraight !== undefined &&
      !filterByOrientation(user, filters.isStraight)
    )
      return false;
    if (
      filters.isMonogamy !== undefined &&
      !filterByMonogamy(user, filters.isMonogamy)
    )
      return false;
    if (filters.heightRange && !filterByHeight(user, filters.heightRange))
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
      !filterByReligion(user, filters.isReligious)
    )
      return false;
    if (
      filters.isSmoking !== undefined &&
      !filterBySmoking(user, filters.isSmoking)
    )
      return false;
    if (filters.isWeed !== undefined && !filterByWeed(user, filters.isWeed))
      return false;
    if (
      filters.isDrinking !== undefined &&
      !filterByDrinking(user, filters.isDrinking)
    )
      return false;
    if (filters.languages && !filterByLanguages(user, filters.languages))
      return false;
    if (
      filters.isJewish !== undefined &&
      !filterByJewish(user, filters.isJewish)
    )
      return false;
    if (
      filters.educationLevel &&
      !filterByEducationLevel(user, filters.educationLevel)
    )
      return false;
    if (
      filters.employmentStatus &&
      !filterByEmploymentStatus(user, filters.employmentStatus)
    )
      return false;
    if (filters.bodyStyle && !filterByBodyStyle(user, filters.bodyStyle))
      return false;
    if (
      filters.minMatchPercentage !== undefined &&
      !filterByMinMatchPercentage(match, filters.minMatchPercentage)
    )
      return false;
    if (filters.isMutualLike !== undefined && !filterByMutualLike(match))
      return false;
    return true;
  });
}
