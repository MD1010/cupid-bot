import type { DetailSentence } from "@/types";

function getDetail(details: DetailSentence[], key: string): string | null {
  const detail = details.find((detail) => detail.name === key);
  return detail ? detail.text : null;
}

function getHeight(details: DetailSentence[]): number | null {
  const heightStr = getDetail(details, "looks");
  return heightStr ? parseInt(heightStr.replace("cm", "").trim()) : null;
}

function hasWords(content: string, words: string[]): [boolean, string[]] {
  const lowerCaseContent = content.toLowerCase();
  const foundWords = words.filter((word) => lowerCaseContent.includes(word.toLowerCase()));
  return [foundWords.length > 0, foundWords];
}

export { getDetail, getHeight, hasWords };
