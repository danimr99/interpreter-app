import Svg, { Path } from "react-native-svg"

const FlashOffIcon = ({ iconColor = 'white' }: {
  iconColor?: string
}): JSX.Element => (
  <Svg
    width="24"
    height="24"
    fill={iconColor}
    stroke={iconColor}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <Path d="M17 10h-4l4-8H7v2.18l8.46 8.46M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3z" />
  </Svg>
)

export default FlashOffIcon
