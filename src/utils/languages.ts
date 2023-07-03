import { LANGUAGES } from "../constants/languages"

export function getLanguageFromCode (code: string) {
  const languageIndex = Object.keys(LANGUAGES).indexOf(code)
  return Object.values(LANGUAGES)[languageIndex]
}