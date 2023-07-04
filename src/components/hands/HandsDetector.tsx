import { Text, View } from 'react-native'
import { Camera, CameraDevices, useFrameProcessor } from 'react-native-vision-camera'
import { runOnJS } from 'react-native-reanimated'

import { COLORS, PREDICTIONS } from '../../constants'
import { estimateHandsPose } from '../../utils/hands-pose-frame-processor'
import { getLanguageFromCode } from '../../utils/languages'
import { translateText } from '../../utils/translations'
import { useCamera } from '../../hooks/useCamera'
import { useHandsDetection } from '../../hooks/useHandsDetection'
import { useTranslation } from '../../hooks/useTranslation'
import { useVoiceOver } from '../../hooks/useVoiceOver'
import {
  IconButton, HandsPose, ToggleCameraIcon, FlashOnIcon, FlashOffIcon, TranslateIcon, VoiceOverIcon, LanguagesIcon, LoadingSpinner
} from '..'
import { ErrorMessageScreen, LoadingScreen } from '../../screens'


const HandsDetector = ({ devices, isCameraActive, detectionLanguageCode }: {
  devices: CameraDevices
  isCameraActive: boolean
  detectionLanguageCode: string
}): JSX.Element => {
  const [device, isLoadingCamera, isCameraFound, isFlashEnabled, toggleCamera, toggleFlash] = useCamera(devices, 'front')
  const [predictions, hands, setHands] = useHandsDetection()
  const [isVoiceOverEnabled, toggleVoiceOver] = useVoiceOver(false)
  const [isTranslationEnabled, isTranslationLoading, toggleTranslation, translationLanguage, setTranslationLanguage, translationText] = useTranslation(detectionLanguageCode, 'es', false, predictions)

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const results = estimateHandsPose(frame)
    runOnJS(setHands)(results)
  }, [])

  if (isLoadingCamera) return <LoadingScreen />

  if (!isLoadingCamera && !isCameraFound) {
    return (
      <ErrorMessageScreen
        errorTitle='Camera Error'
        errorMessage='An error has occurred while trying to access the camera.'
        buttonLabel='Toggle Camera'
        buttonAction={toggleCamera}
      />
    )
  }

  return (
    <View className='relative flex-1'>
      {/* Camera */}
      <Camera
        className='flex-1 z-1'
        orientation='portrait'
        //@ts-ignore
        device={device}
        enableZoomGesture
        isActive={isCameraActive}
        frameProcessor={frameProcessor}
        torch={isFlashEnabled ? 'on' : 'off'}
      />

      {/* Hands Pose */}
      <HandsPose hands={hands} />

      {/* Camera Controls */}
      <View className='absolute flex-row w-full top-0 left-0 right-0 mt-4 z-3 justify-around'>
        <IconButton onClick={toggleFlash}>
          {isFlashEnabled ? <FlashOnIcon iconColor={COLORS.cameraFlash} /> : <FlashOffIcon />}
        </IconButton>
        <IconButton onClick={toggleCamera}>
          <ToggleCameraIcon />
        </IconButton>
        <IconButton onClick={toggleVoiceOver}>
          <VoiceOverIcon iconColor={isVoiceOverEnabled ? COLORS.accent : 'white'} />
        </IconButton>
        <IconButton onClick={toggleTranslation}>
          <TranslateIcon iconColor={isTranslationEnabled ? COLORS.accent : 'white'} />
        </IconButton>
      </View>

      {/* Translations and/or Predictions */}
      {
        predictions.length > PREDICTIONS.CONSECUTIVE_PREDICTIONS_FRAMES && (
          <View className='absolute bottom-0 left-0 right-0 w-full h-32'>
            <View className='flex-1 bg-theme/[0.25]'>
              {/* Stats */}
              <View className='flex-row w-full h-2/5 justify-around'>
                <View className='flex-1 px-4 py-2 justify-center items-center'>
                  <Text className='text-gray-400 text-xs' numberOfLines={1}>Accuracy</Text>
                  <Text className='text-white text-lg text-center' numberOfLines={1}>{(predictions[predictions.length - 1].confidence * 100).toFixed(0)}%</Text>
                </View>
                <View className='flex-1 px-4 py-2 justify-center items-center'>
                  <Text className='text-gray-400 text-xs' numberOfLines={1}>From</Text>
                  <Text className='text-white text-lg text-center' numberOfLines={1}>{getLanguageFromCode(detectionLanguageCode)}</Text>
                </View>
                {
                  (isTranslationEnabled && translationLanguage.length > 0) && (
                    <View className='flex-1 px-4 py-2 justify-center items-center'>
                      <Text className='text-gray-400 text-xs' numberOfLines={1}>To</Text>
                      <Text className='text-white text-lg text-center' numberOfLines={1}>{getLanguageFromCode(translationLanguage)}</Text>
                    </View>
                  )
                }
              </View>

              <View className='flex-1 flex-row'>
                {/* Words */}
                <View className='flex-1 justify-center items-center'>
                  <Text className='text-white text-2xl font-bold' numberOfLines={1}>{predictions[predictions.length - 1].label}</Text>
                  {
                    isTranslationEnabled && (
                      translationLanguage.length > 0 ? (
                        translateText.length > 0 && (
                          isTranslationLoading ? <LoadingSpinner /> : <Text className='text-gray-400 text-lg font-semibold' numberOfLines={1}>{translationText}</Text>
                        )
                      ) : (
                        <Text className='text-gray-400 text-sm' numberOfLines={1}>Select a language to translate</Text>
                      )
                    )
                  }
                </View>

                {/* Translation Languages Button Selector */}
                {
                  isTranslationEnabled && (
                    <View className='w-1/5 justify-center items-center'>
                      <IconButton
                        buttonColor='bg-accent/[0.5]'
                        buttonShape='rounded-lg'
                        onClick={() => {
                          setTranslationLanguage('es')
                        }}>
                        <LanguagesIcon />
                      </IconButton>
                    </View>
                  )
                }
              </View>
            </View>
          </View>
        )
      }
    </View >
  )
}

export default HandsDetector
