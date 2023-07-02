import type { HandSignPrediction } from "../models/prediction"
import { normalizeWord } from "./strings"

export function estimateDetectedSign (predictions: HandSignPrediction[]): HandSignPrediction {
  const estimatedPrediction: HandSignPrediction = {
    label: '',
    confidence: -Infinity
  }

  predictions.forEach((p: HandSignPrediction) => {
    if (p.confidence > estimatedPrediction.confidence) {
      estimatedPrediction.label = normalizeWord(p.label)!
      estimatedPrediction.confidence = p.confidence
    }
  })

  return estimatedPrediction
}