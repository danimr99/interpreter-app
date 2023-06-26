import { Dimensions, View } from 'react-native'
import { Svg } from 'react-native-svg'

import type { HandDetectionResult, HandKeypoint } from '../../models/hand'
import HandKeypointCircle from './HandKeypointCircle'

const HandsPose = ({ hands }: { hands: HandDetectionResult[] }): JSX.Element => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  if (hands.length === 0) return <View />

  return (
    <Svg className='absolute flex-1 z-2'>
      {
        hands.map((hand: HandDetectionResult) => {
          const { handedness } = hand

          return hand.keypoints
            .map((keypoint: HandKeypoint) => {
              const { x, y } = keypoint

              return (
                <HandKeypointCircle
                  key={`${handedness}-${x}-${y}`}
                  x={x * screenWidth}
                  y={y * screenHeight}
                />
              )
            })
        })
      }
    </Svg>
  )
}

export default HandsPose