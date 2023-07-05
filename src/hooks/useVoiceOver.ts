import { useEffect, useState } from 'react'

import { speakText } from '../utils/voice-over'

export function useVoiceOver (initialState: boolean, initialLanguageCode: string) {
  const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState<boolean>(initialState)
  const [voiceOverText, setVoiceOverText] = useState<string>('')
  const [voiceOverLanguage, setVoiceOverLanguage] = useState<string>(initialLanguageCode)

  useEffect(() => {
    if (isVoiceOverEnabled) {
      void processVoiceOver(voiceOverText, voiceOverLanguage)
    }
  }, [voiceOverText, voiceOverLanguage])

  function toggleVoiceOver (): void {
    setIsVoiceOverEnabled((prev) => !prev)
  }

  async function processVoiceOver (text: string, languageCode: string): Promise<void> {
    await speakText(text, languageCode)
  }

  return [isVoiceOverEnabled, toggleVoiceOver, setVoiceOverText, setVoiceOverLanguage] as const
}
