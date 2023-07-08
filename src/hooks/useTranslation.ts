import { useEffect, useState } from 'react'

import { translateText } from '../utils/translations'

export function useTranslation (
  originLanguage: string,
  destinationLanguage: string,
  initialState: boolean,
  textToTranslate: string
) {
  const [isTranslationEnabled, setIsTranslationEnabled] = useState<boolean>(initialState)
  const [isTranslationLoading, setIsTranslationLoading] = useState<boolean>(false)
  const [detectionLanguageCode, setDetectionLanguageCode] = useState<string>(originLanguage)
  const [translationLanguageCode, setTranslationLanguageCode] = useState<string>(destinationLanguage)
  const [translationText, setTranslationText] = useState<string>('')

  useEffect(() => {
    processTranslation()
  }, [textToTranslate])

  function toggleTranslation (): void {
    setIsTranslationEnabled((prev) => !prev)
  }

  async function processTranslation (): Promise<void> {
    if (!isTranslationEnabled) return
    if (translationLanguageCode === '') return

    if (textToTranslate.length > 0) {
      setIsTranslationLoading(true)

      const translatedText = await translateText(textToTranslate, detectionLanguageCode, translationLanguageCode)

      setTranslationText(translatedText)
      setIsTranslationLoading(false)
    }
  }

  return [
    isTranslationEnabled,
    isTranslationLoading,
    toggleTranslation,
    translationLanguageCode,
    setTranslationLanguageCode,
    translationText
  ] as const
}