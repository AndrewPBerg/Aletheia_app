import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={addTime}>
            <Ionicons name="add-circle" size={50} color="#4169E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <Ionicons name="call" size={50} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  timerContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
});

export default VideoCall;
