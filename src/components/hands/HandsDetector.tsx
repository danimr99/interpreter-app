import { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { Camera, CameraDevices, CameraPosition, useFrameProcessor } from 'react-native-vision-camera'
import { runOnJS } from 'react-native-reanimated'

import { COLORS, PREDICTIONS } from '../../constants'
import type { HandDetectionResult } from '../../models/hand'
import type { HandSignPrediction } from '../../models/prediction'
import { estimateHandsPose } from '../../utils/hands-pose-frame-processor'
import { estimateDetectedSign } from '../../utils/predictions'
import { useFetchPrediction } from '../../hooks/useFetchPrediction'
import {
  IconButton, HandsPose, ToggleCameraIcon, FlashOnIcon, FlashOffIcon, TranslateIcon, VoiceOverIcon, LanguagesIcon
} from '..'
import { ErrorMessageScreen, LoadingScreen } from '../../screens'
import { getLanguageFromCode } from '../../utils/languages'


const HandsDetector = ({ devices, isCameraActive, detectionLanguage }: {
  devices: CameraDevices
  isCameraActive: boolean
  detectionLanguage: string
}): JSX.Element => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front')
  const device = cameraPosition === 'front' ? devices.front : devices.back
  const [isLoadingCamera, setIsLoadingCamera] = useState(true)
  const [isCameraFound, setIsCameraFound] = useState(device != null)
  const [isFlashEnabled, setIsFlashEnabled] = useState<boolean>(false)
  const [hands, setHands] = useState<HandDetectionResult[]>([])
  const [setInputHands, data] = useFetchPrediction('http://localhost:8000', '/api/detect', hands)
  const [predictions, setPredictions] = useState<HandSignPrediction[]>([])
  const [isVoiceOverEnabled, setIsVoiceOverEnabled] = useState<boolean>(false)
  const [isTranslationEnabled, setIsTranslationEnabled] = useState<boolean>(false)
  const [translationLanguage, setTranslationLanguage] = useState<string>('')

  // Camera availability
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingCamera(false)

      if (device != null) {
        setIsCameraFound(true)
      } else {
        setIsCameraFound(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [device])

  // Fetch predictions
  useEffect(() => {
    if (hands == null) return
    if (hands.length === 0) return

    setInputHands(hands)
  }, [hands])

  // Process predictions
  useEffect(() => {
    if (data == null) return
    if (data.length === 0) return

    processPredictions(data)
  }, [data])

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const results = estimateHandsPose(frame)
    runOnJS(setHands)(results)
  }, [])

  function processPredictions (unprocessedPredictions: HandSignPrediction[]): void {
    const currentPrediction = estimateDetectedSign(unprocessedPredictions)

    // Check if current prediction confidence is above minimum acceptable
    if (currentPrediction.confidence >= PREDICTIONS.MIN_HAND_DETECTION_CONFIDENCE) {
      // Check if predictions is empty
      if (predictions.length === 0) {
        setPredictions([currentPrediction])
      } else {
        // Get previous prediction
        const previousPrediction = predictions[predictions.length - 1]

        // Check if prediction is different from previous prediction
        if (currentPrediction.label === previousPrediction.label) {
          setPredictions([...predictions, currentPrediction])
        } else {
          setPredictions([currentPrediction])
        }
      }
    }
  }

  function handleToggleCamera (): void {
    setCameraPosition((prev) => (prev === 'front' ? 'back' : 'front'))
  }

  function handleToggleFlash (): void {
    if (cameraPosition === 'front') {
      Alert.alert(
        'Flash Error',
        'Flash is not available when using the front camera.',
        [{ text: 'Ok' }],
        { cancelable: true }
      )
      return
    }

    setIsFlashEnabled((prev) => !prev)
  }

  function handleVoiceOver (): void {
    setIsVoiceOverEnabled((prev) => !prev)
  }

  function handleToggleTranslation (): void {
    setIsTranslationEnabled((prev) => !prev)
  }

  if (isLoadingCamera) return <LoadingScreen />

  if (!isLoadingCamera && !isCameraFound) {
    return (
      <ErrorMessageScreen
        errorTitle='Camera Error'
        errorMessage='An error has occurred while trying to access the camera.'
        buttonLabel='Toggle Camera'
        buttonAction={handleToggleCamera}
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
        // isActive={false}
        frameProcessor={frameProcessor}
        torch={isFlashEnabled ? 'on' : 'off'}
      />

      {/* Hands Pose */}
      <HandsPose hands={hands} />

      {/* Camera Controls */}
      <View className='absolute flex-row w-full top-0 left-0 right-0 mt-4 z-3 justify-around'>
        <IconButton onClick={handleToggleFlash}>
          {isFlashEnabled ? <FlashOnIcon iconColor={COLORS.cameraFlash} /> : <FlashOffIcon />}
        </IconButton>
        <IconButton onClick={handleToggleCamera}>
          <ToggleCameraIcon />
        </IconButton>
        <IconButton onClick={handleVoiceOver}>
          <VoiceOverIcon iconColor={isVoiceOverEnabled ? COLORS.accent : 'white'} />
        </IconButton>
        <IconButton onClick={handleToggleTranslation}>
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
                  <Text className='text-white text-lg text-center' numberOfLines={1}>{getLanguageFromCode(detectionLanguage)}</Text>
                </View>
                {
                  isTranslationEnabled && (
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
                        <Text className='text-gray-400 text-lg font-semibold' numberOfLines={1}>Translation</Text>
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
