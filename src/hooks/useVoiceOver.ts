import { useState } from 'react'

export function useVoiceOver (initialState: boolean) {
  const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState<boolean>(initialState)

  function toggleVoiceOver (): void {
    setIsVoiceOverEnabled((prev) => !prev)
  }

  return [isVoiceOverEnabled, toggleVoiceOver] as const
}
