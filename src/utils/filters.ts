import type { DetailSentence } from "@/types";

function getDetail(details: DetailSentence[], key: string): string | null {
  const detail = details.find((detail) => detail.name === key);
  return detail ? detail.text : null;
}

function getHeight(details: DetailSentence[]): number | null {
  const heightStr = getDetail(details, "looks");
  return heightStr ? parseInt(heightStr.replace("cm", "").trim()) : null;
}

function hasWords(content: string, words: string[]): boolean {
  const lowerCaseContent = content.toLowerCase();
  return words.some((word) => lowerCaseContent.includes(word.toLowerCase()));
}

export { getDetail, getHeight, hasWords };
