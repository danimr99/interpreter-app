import { View } from 'react-native'

const Divider = ({ width = 1, orientation = 'horizontal', color }: {
  width?: number
  orientation?: 'horizontal' | 'vertical'
  color: string
}): JSX.Element => {
  return (
    <View
      style={[
        { width: orientation === 'horizontal' ? '100%' : width },
        { height: orientation === 'vertical' ? '100%' : width },
        { backgroundColor: color },
      ]}
    />
  )
}

export default Divider
