import { useLayoutEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SystemNavigationBar from 'react-native-system-navigation-bar'

import { COLORS } from './constants'

import HandsDetectionScreen from './screens/HandsDetectionScreen'

const Stack = createNativeStackNavigator()

const App = (): JSX.Element => {
  useLayoutEffect(() => {
    void (async () => {
      await SystemNavigationBar.setNavigationColor(COLORS.theme)
    })()
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='HandsDetection' component={HandsDetectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
