import { LANGUAGES } from "../constants/languages"

export function getLanguageFromCode (code: string): string {
  const codeIndex = Object.keys(LANGUAGES).indexOf(code)
  return Object.values(LANGUAGES)[codeIndex]
}

export function getCodeFromLanguage (language: string): string | undefined {
  const languageEntries = Object.entries(LANGUAGES)

  for (const [key, value] of languageEntries) {
    if (value === language) {
      return key
    }
  }

  return undefined
}
