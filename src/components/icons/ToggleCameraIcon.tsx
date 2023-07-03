import Svg, { Path } from "react-native-svg"

const ToggleCameraIcon = ({ iconColor = 'white' }: {
  iconColor?: string
}): JSX.Element => (
  <Svg
    width="24"
    height="24"
    fill="none"
    stroke={iconColor}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M5 7h1a2 2 0 002-2 1 1 0 011-1h6a1 1 0 011 1 2 2 0 002 2h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2" />
    <Path d="M11.245 15.904A3 3 0 0015 13m-2.25-2.905A3 3 0 009 13" />
    <Path d="M14 13h2v2M10 13H8v-2" />
  </Svg>
)

export default ToggleCameraIcon
