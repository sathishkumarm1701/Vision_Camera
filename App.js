import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import MyCamera from './src/VisionCamera/VisionForC';
import VisionForC from './src/VisionCamera/VisionForC';
import VisionCamera from './src/VisionCamera/VisionCamera'
// import CameraScreen from './src/VisionCamera/VisionGIt'

const App = () => {
  return (
    <View style={{flex:1}}>
      <VisionCamera/>
      {/* <CameraScreen/> */}
      {/* <MyCamera/> */}
      {/* <VisionForC/> */}
    </View>
  )
}

export default App;

const styles = StyleSheet.create({})