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
      <TouchableOpacity style={styles.endCallButton} onPress={onClose}>
        <Text style={styles.endCallText}>End Call</Text>
      </TouchableOpacity>
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
  endCallButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  endCallText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VideoCall;
