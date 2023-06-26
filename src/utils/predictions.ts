import type { HandSignPrediction } from "../models/prediction"

export function estimateDetectedSign (predictions: HandSignPrediction[]): HandSignPrediction {
  const estimatedPrediction: HandSignPrediction = {
    label: '',
    confidence: -Infinity
  }

  predictions.forEach((p: HandSignPrediction) => {
    if (p.confidence > estimatedPrediction.confidence) {
      estimatedPrediction.label = p.label
      estimatedPrediction.confidence = p.confidence
    }
  })

  return estimatedPrediction
}
