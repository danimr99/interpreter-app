import { speak } from 'google-translate-api-x'
import * as RNFS from 'react-native-fs'
import Sound from 'react-native-sound'

export async function speakText (text: string, languageCode: string): Promise<boolean> {
  if (text.length > 0) {
    const encodedSound = await speak(text, { to: languageCode, rejectOnPartialFail: false })

    // Check if language is supported by TTS
    if (!encodedSound) return false

    // Save to a temporary file and play sound
    const path = `${RNFS.DocumentDirectoryPath}/tts.mp3`

    RNFS.writeFile(path, encodedSound, { encoding: 'base64' })
      .then(() => {
        const sound = new Sound(path, '', (error) => {
          if (error) {
            console.log('An error has occurred while playing a TTS message', error)
            return
          }

          sound.play()
        })
      })
  }

  return true
}
