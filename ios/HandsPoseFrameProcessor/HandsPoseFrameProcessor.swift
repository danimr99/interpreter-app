@objc(HandsPoseFrameProcessorPlugin)
public class HandsPoseFrameProcessorPlugin: NSObject, FrameProcessorPluginBase {
  @objc public static func callback(_ frame: Frame!, withArgs _: [Any]!) -> Any! {
    let buffer = frame.buffer
    let orientation = frame.orientation
    // code goes here
    return []
  }
}