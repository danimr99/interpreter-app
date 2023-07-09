import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { speakText } from '../utils/tts'

export function useTTS (initialState: boolean, initialLanguageCode: string) {
  const [isTTSEnabled, setIsTTSEnabled] = useState<boolean>(initialState)
  const [ttsLanguage, setTTSLanguage] = useState<string>(initialLanguageCode)
  const [ttsText, setTTSText] = useState<string>('')
  const [isLanguageSupported, setIsLanguageSupported] = useState<boolean>(true)

  // Process TTS
  useEffect(() => {
    void processTTS()
  }, [ttsText, ttsLanguage])

  // Show alert when language is not supported
  useEffect(() => {
    if (!isLanguageSupported) {
      Alert.alert(
        'TTS Error',
        'Selected language is not supported.',
        [{ text: 'Ok' }],
        { cancelable: true }
      )
    }
  }, [isLanguageSupported])

  function toggleTTS (): void {
    setIsTTSEnabled((prev) => !prev)
  }

  async function processTTS (): Promise<void> {
    if (!isTTSEnabled) return
    if (ttsLanguage === '') return

    if (ttsText.length > 0) {
      const result = await speakText(ttsText, ttsLanguage)
      setIsLanguageSupported(result)
    }
  }

  return [isTTSEnabled, toggleTTS, setTTSText, setTTSLanguage] as const
}
