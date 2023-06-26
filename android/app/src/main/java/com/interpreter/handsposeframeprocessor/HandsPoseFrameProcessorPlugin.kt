package com.interpreter.handsposeframeprocessor

import android.annotation.SuppressLint
import android.graphics.*
import android.media.Image
import androidx.camera.core.ImageProxy
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin
import java.io.ByteArrayOutputStream

class HandsPoseFrameProcessorPlugin(reactContext: ReactApplicationContext):
  FrameProcessorPlugin("estimateHandsPose") {
  companion object {
    private const val MP_HAND_LANDMARKER_TASK: String = "hand_landmarker.task"
    private const val MIN_HAND_DETECTION_CONFIDENCE: Float = 0.5F
    private const val MIN_HAND_TRACKING_CONFIDENCE: Float = 0.5F
    private const val MIN_HAND_PRESENCE_CONFIDENCE: Float = 0.5F
    private const val NUM_HANDS: Int = 2
  }

  private var handLandmarker: HandLandmarker

  init {
    // Set model path
    val baseOptionsBuilder = BaseOptions.builder().setModelAssetPath(MP_HAND_LANDMARKER_TASK)
    val baseOptions = baseOptionsBuilder.build()

    // Set up configuration
    val optionsBuilder = HandLandmarker.HandLandmarkerOptions.builder()
      .setBaseOptions(baseOptions)
      .setMinHandDetectionConfidence(MIN_HAND_DETECTION_CONFIDENCE)
      .setMinTrackingConfidence(MIN_HAND_TRACKING_CONFIDENCE)
      .setMinHandPresenceConfidence(MIN_HAND_PRESENCE_CONFIDENCE)
      .setNumHands(NUM_HANDS)
      .setRunningMode(RunningMode.IMAGE)

    val options = optionsBuilder.build()

    // Create a hand landmark detector
    this.handLandmarker = HandLandmarker.createFromOptions(reactContext, options)
  }

  @SuppressLint("UnsafeOptInUsageError")
  override fun callback(image: ImageProxy, params: Array<Any>): Any {
    val hands = WritableNativeArray()

    // Get image rotation degrees
    val imageRotationDegrees = image.imageInfo.rotationDegrees

    // Convert ImageProxy to Bitmap
    var bitmap = this.convertImageProxyToBitmap(image.image!!)

    // Rotate image depending on the camera used
    // 270 -> Front camera
    // 90  -> Back camera
    val matrix = Matrix()
    matrix.postRotate(image.imageInfo.rotationDegrees.toFloat())

    // Set up front camera rotation
    if (imageRotationDegrees == 270) {
      matrix.postScale(-1f, 1f, bitmap.width.toFloat(), bitmap.height.toFloat())
    }

    // Rotate bitmap using configured matrix
    bitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)

    // Convert Bitmap to MPImage
    val mpImage = BitmapImageBuilder(bitmap).build()

    // Detect hands
    val results = handLandmarker.detect(mpImage)

    // Count number of detected hands
    val handsDetectedCounter = results.handednesses().size

    // Iterate through each hand detected
    for (handIndex in 0 until handsDetectedCounter) {
      val hand = WritableNativeMap()

      // Get handedness of each hand detected
      var handedness = results.handednesses()[handIndex][0].displayName()

      // Flip handedness when back camera
      if (imageRotationDegrees == 90) {
        handedness = if (handedness == "Left") "Right" else "Left"
      }

      hand.putString("handedness", handedness)

      // Get score detection of each hand detected
      hand.putDouble("score", results.handednesses()[handIndex][0].score().toDouble())

      // Get hand keypoints of each hand detected
      val handLandmarks = WritableNativeArray()

      for (landmark in results.landmarks()[handIndex]) {
        val handLandmark = WritableNativeMap()

        // Get coordinates for each hand landmark
        handLandmark.putDouble("x", landmark.x().toDouble())
        handLandmark.putDouble("y", landmark.y().toDouble())
        handLandmark.putDouble("z", landmark.z().toDouble())

        // Add landmark to the list of landmarks of the hand
        handLandmarks.pushMap(handLandmark)
      }

      // Add the list of hand landmarks to the hand map
      hand.putArray("keypoints", handLandmarks)

      // Add hand to list of hands
      hands.pushMap(hand)
    }

    return hands
  }

  private fun convertImageProxyToBitmap(image: Image): Bitmap {
    val planes = image.planes
    val yBuffer = planes[0].buffer
    val uBuffer = planes[1].buffer
    val vBuffer = planes[2].buffer

    val ySize = yBuffer.remaining()
    val uSize = uBuffer.remaining()
    val vSize = vBuffer.remaining()

    val nv21 = ByteArray(ySize + uSize + vSize)
    // U and V are swapped
    yBuffer.get(nv21, 0, ySize)
    vBuffer.get(nv21, ySize, vSize)
    uBuffer.get(nv21, ySize + vSize, uSize)

    val yuvImage = YuvImage(nv21, ImageFormat.NV21, image.width, image.height, null)
    val out = ByteArrayOutputStream()
    yuvImage.compressToJpeg(Rect(0, 0, yuvImage.width, yuvImage.height), 75, out)

    val imageBytes = out.toByteArray()
    return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
  }
}