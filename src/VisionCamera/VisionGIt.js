// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Image,
//     ActivityIndicator,
//     SafeAreaView,
//   } from 'react-native';
//   import React, {useEffect, useMemo, useRef, useState} from 'react';
//   import {
//     Camera,
//     sortDevices,
//     useCameraDevices,
//   } from 'react-native-vision-camera';
//   import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//   import * as MediaLibrary from '@pontusab/react-native-media-library';
//   import {useIsFocused} from '@react-navigation/native';
//   import styles from './style';
//   import Feather from 'react-native-vector-icons/Feather';
//   import {useNavigation} from '@react-navigation/native';
//   import {createThumbnail} from 'react-native-create-thumbnail';
//   import {CAMERA_FLASHMODE_OFF, CAMERA_FLASHMODE_ON} from './Constants';
//   import colors from '../../colors/colors';
  
//   function getMaxFps(format) {
//     return format.frameRateRanges.reduce((prev, curr) => {
//       if (curr.maxFrameRate > prev) return curr.maxFrameRate;
//       else return prev;
//     }, 0);
//   }
  
//   export default function CameraScreen() {
//     const devicess = Camera.getAvailableCameraDevices();
//     //
//     const devices = useCameraDevices();
//     // const device = devices.back
  
  
  
//     //
//     console.log('devicess', devicess);
//     const [hasCameraPermissions, setHasCameraPermissions] = useState(false);
//     const [hasAudioPermissions, setHasAudioPermissions] = useState(false);
//     const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false);
//     const [galleryItems, setGalleryItems] = useState([]);
//     const cameraRef = useRef(null);
//     // const devices = useCameraDevices();
//     // const [cameraType, setCameraType] = useState();
//     const [showCamera, setshowCamera] = useState(false);
//     var cameraType = showCamera === false ? devices.front : devices.back;
//     console.log('devices', devices)
//     const [cameraFlash, setCameraFlash] = useState(CAMERA_FLASHMODE_OFF);
//     const [isCameraReady, setIsCameraReady] = useState(false);
//     const isFocused = useIsFocused();
//     const navigation = useNavigation();
//     useEffect(async () => {
//       const cameraStatus = await Camera.getCameraPermissionStatus();
//       if (cameraStatus.status != 'authorized') {
//         const cameraPermission = await Camera.requestCameraPermission();
//         setHasCameraPermissions(cameraPermission.status == 'authorized');
//       } else {
//         setHasCameraPermissions(cameraStatus.status == 'authorized');
//       }
//       const audioStatus = await Camera.getMicrophonePermissionStatus();
//       if (audioStatus.status != 'authorized') {
//         const microphonePermission = await Camera.requestMicrophonePermission();
//         setHasCameraPermissions(microphonePermission.status == 'authorized');
//       } else {
//         setHasCameraPermissions(audioStatus.status == 'authorized');
//       }
  
//       setHasAudioPermissions(audioStatus.status == 'granted');
  
//       const galleryStatus = await MediaLibrary.requestPermissionsAsync();
//       setHasGalleryPermissions(galleryStatus.status == 'granted');
//       if (galleryStatus.status == 'granted') {
//         const userGalleryMedia = await MediaLibrary.getAssetsAsync({
//           sortBy: MediaLibrary.SortBy.creationTime,
//           mediaType: MediaLibrary.MediaType.video,
//         });
//         setGalleryItems(userGalleryMedia.assets);
//       }
//       // setCameraType(devices.back)
//     }, []);
  
//     const format = useMemo(() => {
//       return cameraType?.formats.reduce((prev, curr) => {
//         if (prev == null) return curr;
//         if (getMaxFps(curr) > getMaxFps(prev)) return curr;
//         else return prev;
//       }, undefined);
//     }, [cameraType?.formats]);
  
    
  
//     const recordVideo = async () => {
//       if (cameraRef) {
//         try {
//           const options = {
//             flash: cameraFlash,
//             onRecordingFinished: async video => {
//               console.log('video', video);
//               const source = video.path;
//               let sourceThumb = await generateThumbnail(source, true);
//               navigation.navigate('savePost', {source, sourceThumb});
//             },
//             onRecordingError: error => console.error(error),
//           };
//           cameraRef.current.startRecording(options);
  
//           setTimeout(async () => {
//             cameraRef.current.stopRecording();
//           }, 60000);
//         } catch (error) {
//           console.warn(error);
//         }
//       }
//     };
//     const stopVideo = async () => {
//       if (cameraRef) {
//         cameraRef.current.stopRecording();
//       }
//     };
//     const generateThumbnail = async (source, isCached) => {
//       try {
//         console.log(`file://${source}`);
//         let response = await createThumbnail({
//           url: isCached ? `file://${source}` : source,
//           timeStamp: 5000,
//         }).catch(err => console.log({err}));
//         return response.path;
//       } catch (e) {
//         console.warn('e', e);
//       }
//     };
//     const pickFromGallery = async () => {
//       let result = await launchImageLibrary({
//         mediaType: 'video',
//         // allowsEditing: true,
//         // aspect: [16, 9],
//         quality: 1,
//       });
//       if (!result.cancelled) {
//         let sourceThumb = await generateThumbnail(result.assets[0].uri, false);
//         navigation.navigate('savePost', {
//           source: result.assets[0].uri,
//           sourceThumb,
//         });
//       }
//     };
  
//     // if (!hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions) {
//     //     return (
//     //         <View> </View>
//     //     );
//     // }
//     if (cameraType == null || cameraType == undefined) {
//       return (
//         <ActivityIndicator
//           animating={cameraType == null}
//           size={'large'}
//           color={colors.primary}
//         />
//       );
//     }
//     return (
//       <SafeAreaView style={styles.Container}>
//         {isFocused ? (
      
//           <Camera
//             video={true}
//             photo={true}
//             audio={true}
//             style={styles.Camera}
//             ref={cameraRef}
//             device={cameraType}
//             isActive={isFocused}
//             format={format}
//             // enableZoomGesture={true}
//             hdr={true}
//           />
//         ) : (
//           <View></View>
//         )}
//         <View style={styles.sideBarContainer}>
//           <TouchableOpacity
//             style={styles.sideBarButton}
//             onPress={() => {
//               navigation.navigate('home');
//             }}>
//             <Feather name="x" size={24} color={'white'} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.sideBarButton}
//             onPress={() => {
//               setshowCamera(!showCamera);
//               // cameraType === devices.front
//               //   ? (cameraType = devices.front)
//               //   : (cameraType = devices.back);
  
//               console.log('cameraType', cameraType.hasFlash);
//             }}>
//             <Feather name="refresh-ccw" size={24} color={'white'} />
//             <Text style={styles.iconText}>Flip</Text>
//           </TouchableOpacity>
  
//           <TouchableOpacity
//             style={styles.sideBarButton}
//             onPress={() => {
//               setCameraFlash(
//                 cameraFlash === CAMERA_FLASHMODE_OFF
//                   ? CAMERA_FLASHMODE_ON
//                   : CAMERA_FLASHMODE_OFF,
//               );
//               console.log('cameraFlash', cameraFlash);
//             }}>
//             <Feather name="zap" size={24} color={'white'} />
//             <Text style={styles.iconText}>Flash</Text>
//           </TouchableOpacity>
//         </View>
  
//         <View style={styles.bottomBarContainer}>
//           <View style={styles.recordButtonContainer}>
//             <TouchableOpacity
//               style={styles.recordButton}
//               //    disabled={!isCameraReady}
//               // onPress={() => capturePhoto()}
//               onLongPress={() => recordVideo()}
//               onPressOut={() => stopVideo()}
//             />
//           </View>
        
//         </View>
//       </SafeAreaView>
//     );
//   }