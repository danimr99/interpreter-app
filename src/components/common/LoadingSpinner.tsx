import { ActivityIndicator } from 'react-native'

import { COLORS } from '../../constants'

const LoadingSpinner = ({ size }: { size?: number | "small" | "large" }): JSX.Element => {
  return <ActivityIndicator size={size} color={COLORS.accent} />
}

export default LoadingSpinner