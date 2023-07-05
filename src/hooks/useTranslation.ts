import { useEffect, useRef, useState } from 'react'

import type { HandSignPrediction } from '../models/prediction'
import { translateText } from '../utils/translations'

export function useTranslation (
  originLanguage: string,
  destinationLanguage: string,
  initialState: boolean,
  predictions: HandSignPrediction[]
) {
  const [isTranslationEnabled, setIsTranslationEnabled] = useState<boolean>(initialState)
  const [isTranslationLoading, setIsTranslationLoading] = useState<boolean>(false)
  const [detectionLanguageCode, setDetectionLanguageCode] = useState<string>(originLanguage)
  const [translationLanguageCode, setTranslationLanguageCode] = useState<string>(destinationLanguage)
  const [translationText, setTranslationText] = useState<string>('')
  const previousPrediction = useRef<HandSignPrediction>()

  useEffect(() => {
    processTranslations()
  }, [predictions])

  function toggleTranslation (): void {
    setIsTranslationEnabled((prev) => !prev)
  }

  async function processTranslations (): Promise<void> {
    if (!isTranslationEnabled) return
    if (translationLanguageCode === '') return
    if (previousPrediction.current?.label === predictions[predictions.length - 1].label) return

    setIsTranslationLoading(true)

    const currentPrediction = predictions[predictions.length - 1]
    const translatedPrediction = await translateText(currentPrediction.label, detectionLanguageCode, translationLanguageCode)
    previousPrediction.current = currentPrediction

    setTranslationText(translatedPrediction)
    setIsTranslationLoading(false)
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