import Svg, { Path } from "react-native-svg"

const TranslateIcon = ({ iconColor = 'white' }: {
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
    className="icon icon-tabler icon-tabler-language"
    viewBox="0 0 24 24"
  >
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8" />
    <Path d="M5 9c0 2.144 2.952 3.908 6.7 4M12 20l4-9 4 9M19.1 18h-6.2" />
  </Svg>
)

export default TranslateIcon
