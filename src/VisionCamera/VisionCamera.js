import React, { useRef,useMemo,useCallback } from 'react'
import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Pressable, Image,TouchableOpacity,Slider,TouchableWithoutFeedback,PressableOpacity,Dimensions } from 'react-native'
import { Camera, useCameraDevices,frameRateIncluded ,sortFormats,} from 'react-native-vision-camera'
import RNFS, { getAllExternalFilesDirs } from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionsAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import IonIcon from 'react-native-vector-icons/Ionicons';

// import Permissions from 'react-native-permissions';
// import {ImagePicker} from 'react-native-image-picker'
// import { setAssetPath } from 'ionicons/dist/types/stencil-public-runtime';
import Exif from 'exif-js';
const VisionCamera = () => {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  console.log(device);
   const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [devices.back, devices.front]);
console.log(supportsCameraFlipping);
  const [permissons, setPermissons] = useState();
  const camera = useRef(null);
  const [externalDirectory, setExternalDirectory] = useState('');
  // const [cameraOn, setCameraOn] = useState(true);
  // const [hdr, setHdr] = useState(false);
  // const [cameraType, setCameraType] = useState('back');
  const [captures, setCaptures] = useState(0);
  const [exposureDuration, setExposureDuration] = useState(0.1);
  const [torchActive, setTorchActive] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [iso,setIso] = useState(100)
  // const Cameras = new Camera();
  const [cameraPosition, setCameraPosition] = useState('back');
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);
  // const formats = useMemo(() => {
  //   if (device?.formats == null) return [];
  //   return device.formats.sort(sortFormats);
  // }, [device?.formats]);
  // console.log(formats)
  // useEffect(() => {
  //   Cameras.setExposureDuration(exposureDuration);
  // }, [exposureDuration]);
  // const [path, setPath] = useState();

  // async function saveToCameraRoll() {
  //     const newPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/Camera/myImage.jpg`;
  //     await RNFS.copyFile(photo.path, newPath)
  //         .then(() => {
  //             console.log('Image saved to the gallery!');
  //         })
  //         .catch(error => {
  //             console.log(`Error saving image to gallery: ${error}`);
  //         });
  // }

  // async function requestExternalStoragePermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'External Storage Permission',
  //         message:
  //           'Example App needs access to your external storage ' +
  //           'so you can save the images.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the external storage');
  //     } else {
  //       console.log('External storage permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }



  // async function requestCameraPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: 'Camera Permission',
  //         message:
  //           'Example App needs access to your camera ' +
  //           'so you can take pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the camera');
  //     } else {
  //       console.log('Camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }
  async function requestMicrophonePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message:
            'Example App needs access to your microphone ' +
            'so you can record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the microphone');
      } else {
        console.log('Microphone permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  // const openGallery = () => {
  //   const options = {
  //     title: 'Select Image',
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };

    
  //   ImagePicker.showImagePicker(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //     } else {
  //       // You can use the response.uri to get the path of the selected image
  //       handleSelectedImage(response);
  //     }
  //   });
  // };

//   const handleSelectedImage = (response) => {
// setPermissons(response.uri)
//   };
  
  const getPermissons = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'External Storage Permission',
        message:
          'Example App needs access to your external storage ' +
          'so you can save the images.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the external storage');
    } else {
      console.log('External storage permission denied');
    } 
    const newCameraPermission = await Camera.requestCameraPermission()
    const newMicrophonePermission = await Camera.requestMicrophonePermission()
    // if (newMicrophonePermission === 'authorized' && newCameraPermission === 'authorized') {
    //   setPermissons(true)
    // }
   
  }
  // const checkExposureDurationSupport = async () => {
  //   if (camera.current) {
  //       const isSupported = await camera.current.isExposureDurationSupported();
  //       if (isSupported) {
  //           console.log("Exposure duration is supported on this device");
  //       } else {
  //           console.log("Exposure duration is not supported on this device");
  //       }
  //   }
  // }
  // useEffect(()=>{
  //   checkExposureDurationSupport();
  // },[])
  async function requestFrontCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Front Camera Permission',
          message: 'Your app needs access to the front camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Front camera permission granted');
      } else {
        console.log('Front camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  useEffect(() => {
    requestFrontCameraPermission();
    setExternalDirectory(RNFS.DownloadDirectoryPath);
    getPermissons(); 
    // camera.current.setIso(400);
  }, []);
//   useEffect(() => {
//     const interval = setInterval(() => {
//         TakeSnap();
//     }, 3000);
//     return () => clearInterval(interval);
// }, [interval])
  if (!device) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading</Text>
      </View>
    )
  }


  const TakeSnap = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto({
        flash: 'off',
        enableAutoRedEyeReduction: true,
        // shutterSpeedValue: 10,
        pauseAfterCapture: true,
        qualityPrioritization: 'speed',
        quality: 85,
        base64: true,
        // skipMetadata: true 
      })
      console.log("Photo", photo.metadata,[{Exif}].ShutterSpeedValue = "10");
      // setPath(photo.path);
      const timestamp = Date.now();
      const newPath = ('saved path', `${externalDirectory}/SKimage_${timestamp}.jpg`)
      await RNFS.moveFile(photo.path, newPath);
      console.log(`Image saved to ${newPath}`);

//       const devices = await Camera.getAvailableCameraDevices()
// const filtered = devices.filter((d) => matchesMyExpectations(d))
// const sorted = devices.sort(sortDevicesByAmountOfCameras)
// return {
//   back: sorted.find((d) => d.position === "back"),
//   front: sorted.find((d) => d.position === "front")
// }
      // setCaptures(captures + 1);
      //   if(captures >= 10){
      //     clearInterval(interval);
      //   }
    } else {
      console.error('Failed to take photo!');
    }
  }
  // const flipCamera = () => {
  //   setCameraType(
  //     cameraType === Camera.Constants.Type.back
  //       ? Camera.Constants.Type.front
  //       : Camera.Constants.Type.back
  //   );
  // };
  const setShutterSpeed = () => {
    if (camera.current) {
        camera.current.setExposureDuration(exposureDuration + 0.1);
    }
}
// setShutterSpeed(1000);

// Exif.getData(photo.path, function() {
//   // access the EXIF data here
// }); 
// Exif.setExif(photo.path, 'MeteringMode', 1);
// Exif.setExif(photo.path, 'ExposureProgram', 1);
// Exif.setExif(photo.path, 'Flash', 0);
// React.useEffect(() => {
  
// }, []);
const handleFocus = async (event) => {
  if (camera.current) {
    const { locationX, locationY } = event.nativeEvent;
    const { width, height } = Dimensions.get('window');
    const x = locationX / width;
    const y = locationY / height;
    await camera.current.focus({ x, y });
  }
};
  return (
    <View style={{ flex: 1 }}>
      {/* <TouchableWithoutFeedback onPress={() => setCameraType(cameraType === 'back' ? 'front' : 'back')}> */}
      <Camera
      // cameraType={cameraType}
      // cameraType={cameraType.back}
      onMount={camera.start}
      onUnmount={camera.stop}
        style={{ flex: 1, height: "100%", width: "100%" }}
        device={device}
        isActive={true}
        isRawPhoto={true}
        video={true}
        torch={'of'}
        focusable={true}
        enableZoomGesture
        ref={camera}
        photo={true}
        preset="hd-3840x2160"
        lowLightBoost={true}    
        hdr={true}  
        audio={true}
        // front={front}
        enableHighQualityPhotos={true}
        // format={format}
      />  
      {/* </TouchableWithoutFeedback> */}
      <View style={styles.buttonContainer}>
     
      <TouchableOpacity style={styles.snapButton} onPress={TakeSnap}>
      <FontAwesome name="circle-thin" size={82} color="white" style={styles.text} /> 
      
      </TouchableOpacity>
      {supportsCameraFlipping && (
          <TouchableOpacity onPress={onFlipCameraPressed} disabledOpacity={0.4}>
             {/* <IonIcon name="camera-reverse" color="white" size={24} /> */}
          </TouchableOpacity>
        )}
    </View>
    <View style={{ backgroundColor: 'transparent' }}>
          <TouchableOpacity
            // style={{ flex: 1 }}
            onPress={handleFocus}
          >
            {/* <View style={{ flex: 1 }} /> */}
          </TouchableOpacity>
        </View>
    
    {/* <TouchableOpacity onPress={openGallery} style={styles.gallery}>
          <Text>Gallery</Text>
        </TouchableOpacity> */}
         <View>
        {/* <Text>Shutter Speed: {exposureDuration}</Text> */}
        {/* <Slider
          value={exposureDuration}
          onValueChange={setExposureDuration}
          minimumValue={0.0001}
          maximumValue={1}
          step={0.0001}
        /> */}
      </View>
    </View>
  )
}

export default VisionCamera;

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  snapButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    flexDirection:'row',
    alignSelf:'flex-end',
    borderRadius:40,
    marginLeft:10,
    marginTop:0,
  },
  gallery: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

})

 {/* <TouchableOpacity style={styles.flipButton}>
      <Ionicon name='camera-reverse-outline' size={32} color={"white"}/>
      </TouchableOpacity> */}