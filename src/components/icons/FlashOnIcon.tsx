import Svg, { Path } from "react-native-svg"

const FlashOnIcon = ({ iconColor = 'white' }: {
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
    <Path d="M7 2v11h3v9l7-12h-4l4-8H7z" />
  </Svg>
)

export default FlashOnIcon
