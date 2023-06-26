export interface HandDetectionResult {
  handedness: HandHandedness
  score: number
  keypoints: HandKeypoint[]
}

export type HandHandedness = 'Left' | 'Right'

export interface HandKeypoint {
  x: number
  y: number
  z: number
}
