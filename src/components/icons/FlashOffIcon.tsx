import Svg, { Path } from "react-native-svg"

const FlashOffIcon = ({ iconColor = 'white' }: {
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
    className="icon icon-tabler icon-tabler-bulb-off"
    viewBox="0 0 24 24"
  >
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7-.7.7M11.089 7.083a5 5 0 0 1 5.826 5.84m-1.378 2.611A5.012 5.012 0 0 1 15 16a3.5 3.5 0 0 0-1 3 2 2 0 1 1-4 0 3.5 3.5 0 0 0-1-3 5 5 0 0 1-.528-7.544M9.7 17h4.6M3 3l18 18" />
  </Svg>
)

export default FlashOffIcon
