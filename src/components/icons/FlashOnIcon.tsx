import Svg, { Path } from "react-native-svg"

const FlashOnIcon = ({ iconColor = 'white' }: {
  iconColor?: string
}): JSX.Element => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke={iconColor}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="icon icon-tabler icon-tabler-bulb"
    viewBox="0 0 24 24"
  >
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7-.7.7M9 16a5 5 0 1 1 6 0 3.5 3.5 0 0 0-1 3 2 2 0 0 1-4 0 3.5 3.5 0 0 0-1-3M9.7 17h4.6" />
  </Svg>
)

export default FlashOnIcon
