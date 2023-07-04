import { useEffect, useState } from 'react'
import { Linking } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Permissions from 'react-native-permissions'
import { useCameraDevices } from 'react-native-vision-camera'

import { IS_ANDROID, IS_IOS } from '../utils/platform'
import { HandsDetector, Scaffold } from '../components'
import { LoadingScreen, ErrorMessageScreen } from '../screens'

const HandsDetectionScreen = (): JSX.Element => {
  const navigation = useNavigation()
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<Permissions.PermissionStatus>(Permissions.RESULTS.UNAVAILABLE)
  const isCameraActive = useIsFocused()
  const devices = useCameraDevices()

  useEffect(() => {
    void (async () => {
      await requestCameraPermission()
    })()
  }, [])

  async function requestCameraPermission (): Promise<void> {
    let result: Permissions.PermissionStatus = Permissions.RESULTS.UNAVAILABLE

    try {
      if (IS_ANDROID) {
        result = await Permissions.request(Permissions.PERMISSIONS.ANDROID.CAMERA)
      }

      if (IS_IOS) {
        result = await Permissions.request(Permissions.PERMISSIONS.IOS.CAMERA)
      }

      setCameraPermissionStatus(result)
    } catch (error) {
      console.log('Error requesting camera permission: ', error)
    }
  }

  async function checkCameraPermission (): Promise<void> {
    let result: Permissions.PermissionStatus = Permissions.RESULTS.UNAVAILABLE

    try {
      if (IS_ANDROID) {
        result = await Permissions.check(Permissions.PERMISSIONS.ANDROID.CAMERA)
      }

      if (IS_IOS) {
        result = await Permissions.check(Permissions.PERMISSIONS.IOS.CAMERA)
      }

      setCameraPermissionStatus(result)
    } catch (error) {
      console.log('Error checking camera permission: ', error)
    }
  }

  function handleCameraPermission (): void {
    if (cameraPermissionStatus === Permissions.RESULTS.DENIED) {
      void (async () => {
        await requestCameraPermission()
      })()
    }

    if (cameraPermissionStatus === Permissions.RESULTS.BLOCKED ||
      cameraPermissionStatus === Permissions.RESULTS.UNAVAILABLE) {
      void (async () => {
        await Linking.openSettings()
        await checkCameraPermission()
      })()
    }
  }

  // Camera permissions granted
  if (cameraPermissionStatus === Permissions.RESULTS.GRANTED || cameraPermissionStatus === Permissions.RESULTS.LIMITED) {
    return (
      <Scaffold>
        <HandsDetector
          isCameraActive={isCameraActive}
          devices={devices}
          detectionLanguageCode='en'
        />
      </Scaffold>
    )
  }

  // No camera permissions granted
  if (cameraPermissionStatus === Permissions.RESULTS.DENIED || cameraPermissionStatus === Permissions.RESULTS.BLOCKED) {
    return (
      <ErrorMessageScreen
        errorTitle='Camera Permissions'
        errorMessage='You must grant camera permissions to use this feature.'
        buttonLabel='Allow'
        buttonAction={
          () => {
            void (async () => {
              await handleCameraPermission()
            })()
          }
        }
      />
    )
  }

  // Awaiting camera permissions results
  return <LoadingScreen />
}

export default HandsDetectionScreen
