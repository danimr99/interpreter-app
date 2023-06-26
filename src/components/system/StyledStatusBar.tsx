import { StatusBar } from 'react-native'

import { COLORS } from '../../constants'

const StyledStatusBar = (): JSX.Element => {
  return (
    <StatusBar backgroundColor={COLORS.theme} barStyle='light-content' />
  )
}

export default StyledStatusBar
