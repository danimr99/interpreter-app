import { useEffect, useState } from 'react'

import type { HandDetectionResult } from '../models/hand'
import type { HandSignPrediction } from '../models/prediction'

export function useFetchPrediction (
  url: string,
  endpoint: string,
  hands: HandDetectionResult[]
) {
  const [inputHands, setInputHands] = useState<HandDetectionResult[]>(hands)
  const [data, setData] = useState<HandSignPrediction[]>([])

  useEffect(() => {
    if (hands == null) return
    if (hands.length === 0) return

    async function fetchPrediction () {
      try {
        const response = await fetch(`${url}${endpoint}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(hands)
          })

        const results = await response.json() as HandSignPrediction[]
        setData(results)
      } catch (error) {
        console.log('An error has occurred while trying to fetch predictions')
      }
    }

    fetchPrediction()
  }, [inputHands])

  return [setInputHands, data] as const
}
