import { View, Text } from 'react-native'

import { Button, Scaffold } from '../components'

const ErrorMessageScreen = ({ errorTitle, errorMessage, buttonLabel, buttonAction }: {
  errorTitle: string
  errorMessage: string
  buttonLabel: string
  buttonAction: () => any
}) => {
  return (
    <Scaffold>
      <View className='flex-1 justify-center items-center'>
        <View className='w-4/6 h-1/5'>
          <Text className='font-bold text-white text-xl'>{errorTitle}</Text>
          <Text className='text-white text-sm mt-2'>{errorMessage}</Text>
          <View className='mt-12'>
            <Button
              label={buttonLabel}
              onClick={buttonAction}
            />
          </View>
        </View>
      </View>
    </Scaffold>
  )
}

export default ErrorMessageScreen
