import { memo } from 'react'
import { View, Modal, FlatList, Text, TouchableHighlight } from 'react-native'

import { LANGUAGES } from '../../constants/languages'
import { getLanguageFromCode } from '../../utils/languages'

const LanguagesModal = ({ visible, setIsModalVisible, setLanguage }: {
  visible: boolean
  setIsModalVisible: (isVisible: boolean) => void
  setLanguage: (language: string) => void
}): JSX.Element => {
  const languages = Object.keys(LANGUAGES).map((language) => {
    return {
      code: language,
      name: getLanguageFromCode(language)
    }
  })

  return (
    <Modal
      className='z-10'
      visible={visible}
      transparent={true}
      animationType='slide'
    >
      <View className='flex-1 justify-end'>
        <View className='mx-6 my-4 px-4 py-2 rounded-lg bg-white'>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableHighlight
                onPress={() => {
                  setLanguage(item.code)
                  setIsModalVisible(false)
                }}
              >
                <View className='my-2'>
                  <Text className='text-gray-500 text-lg'>{item.name}</Text>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      </View>
    </Modal>
  )
}

export default memo(LanguagesModal)
