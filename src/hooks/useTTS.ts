import { useEffect, useState } from 'react'

import { speakText } from '../utils/text-to-speech'

export function useTTS (initialState: boolean, initialLanguageCode: string) {
  const [isTTSEnabled, setIsTTSEnabled] = useState<boolean>(initialState)
  const [ttsLanguage, setTTSLanguage] = useState<string>(initialLanguageCode)
  const [ttsText, setTTSText] = useState<string>('')

  useEffect(() => {
    void processTTS()
  }, [ttsText, ttsLanguage])

  function toggleTTS (): void {
    setIsTTSEnabled((prev) => !prev)
  }

  async function processTTS (): Promise<void> {
    if (!isTTSEnabled) return
    if (ttsLanguage === '') return

    if (ttsText.length > 0) {
      await speakText(ttsText, ttsLanguage)
    }
  }

  return [isTTSEnabled, toggleTTS, setTTSText, setTTSLanguage] as const
}
