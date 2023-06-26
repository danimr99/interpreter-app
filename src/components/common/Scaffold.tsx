import { useLayoutEffect, type ReactNode } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { StyledStatusBar } from '../'

const Scaffold = ({ className, children }: { className?: string, children: ReactNode }): JSX.Element => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  return (
    <View className={`flex-1 bg-theme ${className}`}>
      <StyledStatusBar />
      {children}
    </View>
  )
}

export default Scaffold