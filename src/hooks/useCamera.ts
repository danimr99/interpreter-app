import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { CameraDevices, CameraPosition } from 'react-native-vision-camera'

export function useCamera (
  devices: CameraDevices,
  initialCameraPosition: CameraPosition
) {
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>(initialCameraPosition)
  const device = cameraPosition === 'front' ? devices.front : devices.back
  const [isLoadingCamera, setIsLoadingCamera] = useState(true)
  const [isCameraFound, setIsCameraFound] = useState(device != null)
  const [isFlashEnabled, setIsFlashEnabled] = useState<boolean>(false)

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

  function toggleCamera (): void {
    setCameraPosition((prev) => (prev === 'front' ? 'back' : 'front'))
  }

  function toggleFlash (): void {
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

  return [device, isLoadingCamera, isCameraFound, isFlashEnabled, toggleCamera, toggleFlash] as const
}