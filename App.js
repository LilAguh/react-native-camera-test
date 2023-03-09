import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library'
import React, { useEffect, useRef, useState } from 'react';
import Button from './src/components/Button';

export default function App() {
  const [hasCameraPermissions, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync()
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
    })();
  }, [])

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        console.log(data)
        setImage(data.uri)
      }
      catch (error) {
        console.log(error)
      }
    }
  }

  const savePicture = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image)
        Alert('Picture save')
        setImage(null)
      }
      catch (error) {
        console.log(error)
      }
      // setImage(null)
    }
  }

  const rotateCamera = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back)
  }

  const flashOn = () => {
    setFlash(flash === Camera.Constants.FlashMode.off ?
      Camera.Constants.FlashMode.on :
      Camera.Constants.FlashMode.off)
  }

  if (hasCameraPermissions === false) {
    return <Text>No tengo acceso a la camara, gorriado</Text>
  }

  return (
    <View style={styles.container}>
      {!image ?
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30
          }}>
            <Button icon='retweet' onPress={rotateCamera} />
            <Button icon='flash' onPress={flashOn}
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'} />
          </View>
        </Camera>
        : <Image source={{ uri: image }} style={styles.camera} />
      }
      <View>
        {image ?
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30
          }}>
            <Button title={"Re-take"} icon='retweet' onPress={() => setImage(null)} />
            <Button title={"Save"} icon='check' onPress={savePicture} />
          </View>
          :
          <Button title={'Take a picture'} icon='camera' onPress={takePicture} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 8,
    paddingBottom: 20,
    height: '100%'
  },
  camera: {
    flex: 1,
    borderRadius: 20,
    height: '50%'
  }
});
