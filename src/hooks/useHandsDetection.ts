import { useEffect, useState } from 'react'

import { PREDICTIONS } from '../constants'
import type { HandSignPrediction } from '../models/prediction'
import type { HandDetectionResult } from '../models/hand'
import { useFetchPredictions } from './useFetchPredictions'
import { estimateDetectedSign } from '../utils/predictions'

export function useHandsDetection () {
  const [hands, setHands] = useState<HandDetectionResult[]>([])
  const [setInputHands, data] = useFetchPredictions('http://localhost:8000', '/api/detect', hands)
  const [predictions, setPredictions] = useState<HandSignPrediction[]>([])

  // Fetch predictions
  useEffect(() => {
    if (hands == null) return
    if (hands.length === 0) return

    setInputHands(hands)
  }, [hands])

  // Process predictions
  useEffect(() => {
    if (data == null) return
    if (data.length === 0) return

    processPredictions(data)
  }, [data])

  function processPredictions (unprocessedPredictions: HandSignPrediction[]): void {
    const currentPrediction = estimateDetectedSign(unprocessedPredictions)

    // Check if current prediction confidence is above minimum acceptable
    if (currentPrediction.confidence >= PREDICTIONS.MIN_HAND_DETECTION_CONFIDENCE) {
      // Check if predictions is empty
      if (predictions.length === 0) {
        setPredictions([currentPrediction])
      } else {
        // Get previous prediction
        const previousPrediction = predictions[predictions.length - 1]

        // Check if prediction is different from previous prediction
        if (currentPrediction.label === previousPrediction.label) {
          setPredictions([...predictions, currentPrediction])
        } else {
          setPredictions([currentPrediction])
        }
      }
    }
  }

  return [
    predictions,
    hands,
    setHands
  ] as const
}
