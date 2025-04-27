import { polishBlacklist } from "../consts/whisper_blacklist";

export const containsBlacklistedWords = (transcription: string) => {
  return polishBlacklist.some((word) => transcription.includes(word));
};
