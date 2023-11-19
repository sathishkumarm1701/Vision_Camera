// import React, { useState,useEffect ,useRef} from 'react';
// import { View, Text, Slider, TouchableOpacity, Image } from 'react-native';
// import { Camera } from 'react-native-vision-camera';
// import { PermissionsAndroid } from 'react-native';


// const MyCamera = () => {
//   const [exposureDuration, setExposureDuration] = useState(0.1);
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
// //   const [type, setType] = useState(Camera.Constants.Type.back);
//   const [capturedImage, setCapturedImage] = useState(null);
// //   const camera = new Camera();
//   const [cameraType, setCameraType] = useState('back');
// const camera = useRef(null)
//   // Set the exposure duration when the component mounts
//   useEffect(() => {
//     // camera.setExposureDuration(exposureDuration);
//   }, [exposureDuration]); 

//   // Ask for camera permissions
//   async function requestCameraPermission() {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message:
//               'Example App needs access to your camera ' +
//               'so you can take pictures.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('You can use the camera');
//         } else {
//           console.log('Camera permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   useEffect(() => {
//    requestCameraPermission();
//   }, []);

// //   Handle camera errors
// //   camera.onError((error) => {
// //     console.log('Camera error: ', error);
// //   });

//   const flipCamera = () => {
//     setCameraType(cameraType === 'back' ? 'front' : 'back');
// };

//   const takePicture = async () => {
//     if (camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await camera.takePictureAsync(options);
//       setCapturedImage(data.uri);
//     }
//   };

//   if (hasCameraPermission === null) {
//     return <View />;
//   }
//   if (hasCameraPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   return (
//     <View>
//       <Camera
//         style={{ flex: 1 }}
//         type={cameraType}  onMount={camera.start} onUnmount={camera.stop}>
// {capturedImage && <Image source={{ uri: capturedImage }} style={{ flex: 1 }} />}
// </Camera>
// <View>
// <Text>Shutter Speed: {exposureDuration}</Text>
// <Slider
//        value={exposureDuration}
//        onValueChange={setExposureDuration}
//        minimumValue={0.0001}
//        maximumValue={1}
//        step={0.0001}
//      />
// <TouchableOpacity onPress={flipCamera}>
// <Text>Flip Camera</Text>
// </TouchableOpacity>
// <TouchableOpacity onPress={takePicture}>
// <Text>Take Picture</Text>
// </TouchableOpacity>
// </View>
// </View>
// );
// };

// export default MyCamera;



import React, { useRef, useState } from 'react';
import { StyleSheet, Alert, Touchable, Button,Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import BottomButtons from './components/BottomButtons/BottomButtons';
// import ImagePreview from './components/ImagePreview/ImagePreview';
// import TopButtons from './components/TopButtons/TopButtons';

function VisionForC() {
  const camera = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);

  /* Here we use hook provided by library to take available devices (lenses) */
  const availableDevices = useCameraDevices();

  /* useCameraDevices hook returns an object with front/back properties,
     that you can use to switch between back and front camera */
  const currentDevice =
    frontCamera && availableDevices?.front ? availableDevices.front : availableDevices?.back;

  const takePhoto = async () => {
    try {
      const result = await camera.current?.takePhoto();
      if (result?.path) setPreviewImage(result.path);
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const flipCamera = () => setFrontCamera((prevState) => !prevState);
  const toggleTorch = () => setTorchActive((prevState) => !prevState);

  /* There is an additional check to prevent errors.
     Camera component needs a valid device prop,
     we need to stop rendering if the device is falsy value. */
  if (!currentDevice) return null;

  if (previewImage && showPreview) {
    return <ImagePreview path={previewImage} dismissPreview={() => setShowPreview(false)} />;
  }

  return (
    <React.Fragment>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={currentDevice}
        isActive={true}
        photo={true}
        torch={torchActive ? 'on' : 'off'}
      />
      <Button torchActive={torchActive} toggleTorch={toggleTorch} />
      <Touchable
        showPreview={() => setShowPreview(true)}
        takePhoto={takePhoto}
        flipCamera={flipCamera}
      ><Text>Snap</Text></Touchable>
    </React.Fragment>
  );
}

export default VisionForC;