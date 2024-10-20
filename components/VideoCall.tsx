import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface VideoCallProps {
  userVideo: any;
  connectionVideo: any;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ userVideo, connectionVideo, onClose }) => {
  const [timer, setTimer] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onClose]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const addTime = () => {
    setTimer((prevTimer) => prevTimer + 5 * 60); // Add 5 minutes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      <View style={styles.videoContainer}>
        <Video
          source={connectionVideo}
          style={styles.mainVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
        />
        <Video
          source={userVideo}
          style={styles.smallVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addTimeButton} onPress={addTime}>
          <Text style={styles.buttonText}>Add 5 Minutes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={onClose}>
          <Text style={styles.buttonText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  timer: {
    position: 'absolute',
    top: 40,
    left: 20,
    color: 'white',
    fontSize: 18,
    zIndex: 1,
  },
  videoContainer: {
    flex: 1,
  },
  mainVideo: {
    width: '100%',
    height: '100%',
  },
  smallVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: width * 0.3,
    height: height * 0.2,
    borderRadius: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addTimeButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  endCallButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VideoCall;
