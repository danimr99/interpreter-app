import { Frame } from 'react-native-vision-camera'
import 'react-native-reanimated'

import type { HandDetectionResult } from '../models/hand'

export function estimateHandsPose (frame: Frame): HandDetectionResult[] {
  'worklet'

  //@ts-ignore
  return __estimateHandsPose(frame)
}
