import { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { Camera, CameraDevices, CameraPosition, useFrameProcessor } from 'react-native-vision-camera'
import { runOnJS } from 'react-native-reanimated'

import { PREDICTIONS } from '../../constants'
import type { HandDetectionResult } from '../../models/hand'
import type { HandSignPrediction } from '../../models/prediction'
import { useFetchPrediction } from '../../hooks/useFetchPrediction'
import { estimateHandsPose } from '../../utils/hands-pose-frame-processor'
import { estimateDetectedSign } from '../../utils/predictions'
import {
  IconButton, HandsPose, ToggleCameraIcon, FlashOnIcon, FlashOffIcon, TranslateIcon
} from '..'
import { ErrorMessageScreen, LoadingScreen } from '../../screens'

const HandsDetector = ({ devices, isCameraActive }: { devices: CameraDevices, isCameraActive: boolean }): JSX.Element => {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front')
  const device = cameraPosition === 'front' ? devices.front : devices.back
  const [isLoadingCamera, setIsLoadingCamera] = useState(true)
  const [isCameraFound, setIsCameraFound] = useState(device != null)
  const [isFlashEnabled, setIsFlashEnabled] = useState<boolean>(false)
  const [hands, setHands] = useState<HandDetectionResult[]>([])
  const [inputHands, setInputHands, data] = useFetchPrediction('http://localhost:8000', '/api/detect', hands)
  const [predictions, setPredictions] = useState<HandSignPrediction[]>([])

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

  function toggleCamera (): void {
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
      <View className='absolute flex-row top-4 right-4 z-3'>
        <IconButton onClick={toggleCamera}>
          <ToggleCameraIcon />
        </IconButton>
        <View className='w-4' />
        <IconButton onClick={handleToggleFlash}>
          {isFlashEnabled ? <FlashOnIcon /> : <FlashOffIcon />}
        </IconButton>
      </View>

      {/* Predictions */}
      {
        predictions.length > PREDICTIONS.CONSECUTIVE_PREDICTIONS_FRAMES && (
          <View className='absolute bottom-4 left-0 right-0 h-20 bg-theme/[0.5] rounded-xl mx-6'>
            <View className='flex-1 flex-row justify-around items-center'>
              <View className='justify-center items-center h-full'>
                <Text className='text-white text-2xl font-bold'>{predictions[predictions.length - 1].label}</Text>
                <Text className='text-white text-sm'>{`Accuracy: ${(predictions[predictions.length - 1].confidence * 100).toFixed(0)}%`}</Text>
              </View>

              <View>
                <IconButton buttonColor='bg-accent' onClick={() => { }}>
                  <TranslateIcon />
                </IconButton>
              </View>

            </View>
          </View>
        )
      }
    </View>
  )
}

export default HandsDetector
