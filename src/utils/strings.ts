export function normalizeWord (word: string): string | undefined {
  const formattedWord = word.split('_').join(' ')
  const pascalizedWord = toStartCase(formattedWord)

  return pascalizedWord
}

export function toStartCase (text: string): string | undefined {
  return text?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join(' ')
}

