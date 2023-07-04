import { translate } from 'google-translate-api-x'

export async function translateText (text: string, originLanguage: string, destinationLanguage: string): Promise<string> {
  const response = await translate(
    text,
    {
      from: originLanguage,
      to: destinationLanguage,
      autoCorrect: true
    }
  )

  return response.text
}
