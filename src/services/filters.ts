import {
  EMPLOYED_STATUSES,
  FAT_BODY_TYPES,
  RELIGIOUS_RESERVED_WORDS,
} from "@/consts";
import type {
  CupidFilters,
  CupidUser,
  LocationCoordinates,
  Match,
  NumericRange,
} from "@/types";
import { getDetail, getHeight, hasWords } from "@/utils/filters";
import {
  calculateDistanceKm,
  getCitiesCoordinates,
  getMyLocationCoords,
  normalizeLocation,
} from "@/utils/location";
import { normalizeString } from "@/utils/string";

function filterByOrientation(
  user: CupidUser,
  isStraight: boolean,
  passIfNotSpecified: boolean
): [boolean, string] {
  const orientation = getDetail(user.detailSentences, "basics");
  if (passIfNotSpecified && !orientation) return [true, ""];
  const result = orientation.includes("Straight") === isStraight;
  return [result, result ? "" : "Orientation mismatch"];
}

function filterByMonogamy(
  user: CupidUser,
  isMonogamy: boolean,
  passIfNotSpecified: boolean
): [boolean, string] {
  const monogamy = getDetail(user.detailSentences, "basics");
  if (passIfNotSpecified && !monogamy) return [true, ""];
  const result = monogamy.includes("Monogamous") === isMonogamy;
  return [result, result ? "" : "Monogamy mismatch"];
}

function filterByHeight(
  user: CupidUser,
  heightRange: NumericRange
): [boolean, string] {
  const height = getHeight(user.detailSentences);
  if (!height) return [true, ""];
  const result = height >= heightRange.from && height <= heightRange.to;
  return [result, result ? "" : "Height mismatch"];
}

function filterByExcludeWords(
  user: CupidUser,
  excludeWords: string[]
): [boolean, string] {
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

  const [hasExcludedWords, foundWords] = hasWords(allText, excludeWords);
  const result = !hasExcludedWords;
  return [
    result,
    result ? "" : `Contains excluded words: ${foundWords.join(", ")}`,
  ];
}

function filterByIncludeWords(
  user: CupidUser,
  includeWords: string[]
): [boolean, string] {
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

  const [result] = hasWords(allText, includeWords);
  return [result, result ? "" : "Does not contain required words"];
}

function filterByReligion(
  user: CupidUser,
  isReligious: boolean
): [boolean, string] {
  const result =
    (isReligious && filterByIncludeWords(user, RELIGIOUS_RESERVED_WORDS)[0]) ||
    (!isReligious && filterByExcludeWords(user, RELIGIOUS_RESERVED_WORDS)[0]);
  return [result, result ? "" : "Religion mismatch"];
}

function filterBySmoking(
  user: CupidUser,
  isNotSmoking: boolean
): [boolean, string] {
  const lifestyleDetail = getDetail(user.detailSentences, "lifestyle");

  if (!lifestyleDetail) return [true, ""];
  const result =
    (lifestyleDetail?.includes("Doesn't smoke") && isNotSmoking) ||
    (lifestyleDetail?.includes("Smokes cigarettes") && !isNotSmoking) ||
    (!lifestyleDetail?.includes("Smokes cigarettes") && isNotSmoking);

  return [result, result ? "" : "Smoking preference mismatch"];
}

function filterByWeed(user: CupidUser, isNotWeed: boolean): [boolean, string] {
  const lifestyleDetail = getDetail(user.detailSentences, "lifestyle");
  if (!lifestyleDetail) return [true, ""];

  const result =
    (lifestyleDetail?.includes("Never smokes marijuana") && isNotWeed) ||
    (lifestyleDetail?.includes("Smokes marijuana") && !isNotWeed) ||
    (!lifestyleDetail?.includes("Smokes marijuana") && isNotWeed);

  return [result, result ? "" : "Weed preference mismatch"];
}

function filterByDrinking(
  user: CupidUser,
  isDrinking: boolean,
  passIfNotSpecified: boolean
): [boolean, string] {
  const drinking = getDetail(user.detailSentences, "lifestyle");
  if (passIfNotSpecified && !drinking) return [true, ""];
  const result =
    (drinking?.includes("Drinks") && isDrinking) ||
    (drinking?.includes("Doesn't drink") && !isDrinking);
  return [result, result ? "" : "Drinking preference mismatch"];
}

function filterByLanguages(
  user: CupidUser,
  languages: string[],
  passIfNotSpecified: boolean
): [boolean, string] {
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

  if (passIfNotSpecified && !userLanguages.length) return [true, ""];

  const lowerCaseLanguages = languages.map((lang) => lang.toLowerCase());
  const result = lowerCaseLanguages.some((lang) =>
    userLanguages.includes(lang)
  );
  return [result, result ? "" : "Language preference mismatch"];
}

function filterByJewish(
  user: CupidUser,
  isJewish: boolean,
  passIfNotSpecified: boolean
): [boolean, string] {
  const religion = getDetail(user.detailSentences, "background");
  if (passIfNotSpecified && !religion) return [true, ""];
  const result =
    (religion?.includes("Jewish") && isJewish) ||
    (!religion?.includes("Jewish") && !isJewish);
  return [result, result ? "" : "Jewish preference mismatch"];
}

function filterByEducationLevel(
  user: CupidUser,
  passIfNotSpecified: boolean
): [boolean, string] {
  const education = getDetail(user.detailSentences, "background");
  if (passIfNotSpecified && !education) return [true, ""];
  const result = education?.includes("Graduate degree");
  return [result, result ? "" : "Education level mismatch"];
}

function filterByEmployment(
  user: CupidUser,
  passIfNotSpecified: boolean
): [boolean, string] {
  const employment = getDetail(user.detailSentences, "background") || "";

  if (passIfNotSpecified && !employment) return [true, ""];
  const result = EMPLOYED_STATUSES.some((status) =>
    employment?.toLowerCase().includes(status.toLowerCase())
  );
  return [result, result ? "" : "Employment status mismatch"];
}

function filterByBodyStyle(
  user: CupidUser,
  passIfNotSpecified: boolean
): [boolean, string] {
  const looks = getDetail(user.detailSentences, "looks");
  if (passIfNotSpecified && !looks) return [true, ""];
  const result = FAT_BODY_TYPES.every(
    (fatType) => !looks?.toLowerCase().includes(fatType.toLowerCase())
  );
  return [result, result ? "" : "Body style mismatch"];
}

function filterByMinMatchPercentage(
  match: Match,
  minMatchPercentage: number
): [boolean, string] {
  const result = match.matchPercent >= minMatchPercentage;
  return [result, result ? "" : "Match percentage below threshold"];
}

function filterByMutualLike(match: Match): [boolean, string] {
  const result = match.targetLikes;
  return [result, result ? "" : "Mutual like mismatch"];
}

function filterByHasKids(
  user: CupidUser,
  hasKids: boolean,
  passIfNotSpecified: boolean
): [boolean, string] {
  const family = getDetail(user.detailSentences, "family");
  if (passIfNotSpecified && !family) return [true, ""];

  const result =
    (hasKids && family?.includes("Has kid")) ||
    (!hasKids && !family?.includes("Has kid"));
  return [result, result ? "" : "Kids preference mismatch"];
}

async function filterByPlace(
  user: CupidUser,
  fromLocationCoords: LocationCoordinates,
  matchCoords: LocationCoordinates,
  maxDistanceKm: number,
  passIfNotSpecified: boolean
): Promise<[boolean, string]> {
  const matchLocation = user.location.summary;

  if (passIfNotSpecified && !matchLocation) return [true, ""];

  try {
    const distanceKm = calculateDistanceKm(fromLocationCoords, matchCoords);

    const result = distanceKm <= maxDistanceKm;

    return [result, result ? "" : `Distance mismatch: ${distanceKm} km away`];
  } catch (error) {
    console.error(error);
    return [false, "Error in calculating distance"];
  }
}

export async function getRelevantMatchesByFilters(
  matches: Match[],
  filters: CupidFilters,
  passIfNotSpecified: boolean
): Promise<{ foundMatches: Match[]; reasons: Record<string, string> }> {
  const foundMatches: Match[] = [];
  const reasons: Record<string, string> = {};

  const validMatches = matches.filter(match => !!match.user.age) // remove invalid users

  const coordinatesMap = await getCitiesCoordinates();
  const userCoords = await getMyLocationCoords();

  for (const match of validMatches) {
    const user = match.user;

    let isMatch = true;
    const reasonsList: string[] = [];


    if (filters.isStraight !== undefined) {
      const [result, reason] = filterByOrientation(
        user,
        filters.isStraight,
        passIfNotSpecified
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isMonogamy !== undefined) {
      const [result, reason] = filterByMonogamy(
        user,
        filters.isMonogamy,
        passIfNotSpecified
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.heightRange) {
      const [result, reason] = filterByHeight(user, filters.heightRange);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.filterIfHasWords) {
      const [result, reason] = filterByExcludeWords(
        user,
        filters.filterIfHasWords
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.onlyAcceptIfIncludeWords) {
      const [result, reason] = filterByIncludeWords(
        user,
        filters.onlyAcceptIfIncludeWords
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isReligious !== undefined) {
      const [result, reason] = filterByReligion(user, filters.isReligious);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isSmoking !== undefined) {
      const [result, reason] = filterBySmoking(user, filters.isSmoking);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isWeed !== undefined) {
      const [result, reason] = filterByWeed(user, filters.isWeed);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isDrinking !== undefined) {
      const [result, reason] = filterByDrinking(
        user,
        filters.isDrinking,
        passIfNotSpecified
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.languages) {
      const [result, reason] = filterByLanguages(
        user,
        filters.languages,
        passIfNotSpecified
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isJewish !== undefined) {
      const [result, reason] = filterByJewish(
        user,
        filters.isJewish,
        passIfNotSpecified
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isEducated) {
      const [result, reason] = filterByEducationLevel(user, passIfNotSpecified);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isEmployed) {
      const [result, reason] = filterByEmployment(user, passIfNotSpecified);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isNotSemitrailer) {
      const [result, reason] = filterByBodyStyle(user, passIfNotSpecified);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.minMatchPercentage !== undefined) {
      const [result, reason] = filterByMinMatchPercentage(
        match,
        filters.minMatchPercentage
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.isMutualLike !== undefined) {
      const [result, reason] = filterByMutualLike(match);
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }
    if (filters.hasKids !== undefined) {
      const [result, reason] = filterByHasKids(
        match.user,
        filters.hasKids,
        passIfNotSpecified
      );
      if (!result) reasonsList.push(reason);
      isMatch = isMatch && result;
    }

    if (filters.maxDistance) {
      const matchCoords =
        coordinatesMap[
          normalizeLocation(normalizeString(match.user.location?.summary))
        ];

      if (!matchCoords) isMatch = true;

      if (matchCoords) {
        const [result, reason] = await filterByPlace(
          user,
          userCoords,
          matchCoords,
          filters.maxDistance,
          passIfNotSpecified
        );

        if (!result) reasonsList.push(reason);
        isMatch = isMatch && result;
      }
    }

    if (isMatch) {
      foundMatches.push(match);
    } else {
      reasons[user.id] = reasonsList.join(", ");
    }
  }

  return { foundMatches, reasons };
}
