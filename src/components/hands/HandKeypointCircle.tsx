import { Circle } from "react-native-svg"

import { COLORS } from "../../constants"

const HandKeypointCircle = ({ x, y }: {
  x: number,
  y: number
}) => {
  return (
    <Circle
      cx={x}
      cy={y}
      r='3'
      fill={COLORS.accent}
      strokeWidth='2'
      stroke='white'
    />
  )
}

export default HandKeypointCircle
