import { Text, View } from 'react-native'

import { Scaffold, LoadingSpinner } from '../components'

const LoadingScreen = () => {
  return (
    <Scaffold className='flex-row justify-center items-center'>
      <Text className='text-white text-lg'>Loading...</Text>
      <View className='w-4' />
      <LoadingSpinner size='small' />
    </Scaffold>
  )
}

export default LoadingScreen