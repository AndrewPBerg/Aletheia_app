import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Animated, Text, Platform, Image } from 'react-native';
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useGlobalState } from '@/context/GlobalStateContext';
import { LinearGradient } from 'expo-linear-gradient';
import aletheiaLogo from '../../assets/images/aletheia_logo.png';

const { width, height } = Dimensions.get('window');
const iconSize = 50; // Size of each icon box
const iconMargin = 10; // Margin between icon boxes

// Update the video interface to include age
interface Video {
  id: number;
  name: string;
  age: number; // Add age property
  source: any;
  preferredTime: string;
}

// Update the videos array with age
export const videos: Video[] = [
  { 
    id: 1, 
    name: 'Edna M.', 
    age: 35, // Add age
    source: require('../../assets/video_profiles/edna_profile.mp4'),
    preferredTime: '12:00 AM'
  },
  { 
    id: 2, 
    name: 'Anya B.', 
    age: 29, // Add age
    source: require('../../assets/video_profiles/anya_profile.mp4'),
    preferredTime: '2:00 PM'
  },
];

interface VideoStatus {
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  progress: number;
}

export default function ProfilesTab() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState<{ [key: number]: VideoStatus }>({});
  const [likedVideos, setLikedVideos] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef(null);
  const videoRefs = useRef<{ [key: number]: ExpoVideo | null }>({});
  const doubleTapRef = useRef<{ [key: number]: NodeJS.Timeout | null }>({});
  const likeAnimationRef = useRef<{ [key: number]: Animated.Value }>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addLikedVideo, addConnection } = useGlobalState();
  const [manuallyPaused, setManuallyPaused] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    Object.keys(likedVideos).forEach((index) => {
      if (likedVideos[Number(index)]) {
        fadeInAndOut(Number(index));
      }
    });
  }, [likedVideos]);

  const togglePlayPause = (index: number) => {
    if (videoRefs.current[index]) {
      if (videoStatus[index]?.isPlaying) {
        (videoRefs.current[index] as ExpoVideo).pauseAsync();
        setManuallyPaused(prev => ({ ...prev, [index]: true }));
      } else {
        (videoRefs.current[index] as ExpoVideo).playAsync();
        setManuallyPaused(prev => ({ ...prev, [index]: false }));
      }
      setVideoStatus(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          isPlaying: !prev[index]?.isPlaying
        }
      }));
    }
  };

  const handleDoubleTap = (index: number) => {
    if (doubleTapRef.current[index]) {
      clearTimeout(doubleTapRef.current[index]!);
      doubleTapRef.current[index] = null;
      likeVideo(index);
    } else {
      doubleTapRef.current[index] = setTimeout(() => {
        doubleTapRef.current[index] = null;
        togglePlayPause(index);
      }, 300);
    }
  };

  const fadeInAndOut = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1800), // Wait for 1.8 seconds (total 2 seconds with fade in/out)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset the liked state after animation
      setLikedVideos(prev => ({ ...prev, [index]: false }));
    });
  };

  const likeVideo = (index: number) => {
    setLikedVideos(prev => ({ ...prev, [index]: true }));
    if (!likeAnimationRef.current[index]) {
      likeAnimationRef.current[index] = new Animated.Value(0);
    }
    likeAnimationRef.current[index].setValue(0);
    Animated.spring(likeAnimationRef.current[index], {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Add the liked video to connections
    addLikedVideo(videos[index].name);
    addConnection(videos[index]);
  };

  const renderVideoItem = ({ item, index }: { item: Video; index: number }) => (
    <View style={styles.videoContainer}>
      <TouchableWithoutFeedback onPress={() => handleDoubleTap(index)}>
        <View style={styles.videoWrapper}>
          <ExpoVideo
            ref={(ref) => { videoRefs.current[index] = ref; }}
            source={item.source}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay={index === activeVideoIndex && !manuallyPaused[index]}
            isLooping={true}
            style={styles.video}
            useNativeControls={false}
            onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
              if (status.isLoaded) {
                const progress = status.durationMillis 
                  ? status.positionMillis / status.durationMillis 
                  : 0;
                setVideoStatus(prev => ({ 
                  ...prev, 
                  [index]: {
                    isPlaying: status.isPlaying,
                    positionMillis: status.positionMillis,
                    durationMillis: status.durationMillis || 0,
                    progress: progress
                  } 
                }));
              }
            }}
          />
          {likedVideos[index] && (
            <Animated.View style={[
              styles.likeAnimation,
              {
                transform: [
                  { scale: likeAnimationRef.current[index] || new Animated.Value(0) },
                  { translateY: (likeAnimationRef.current[index] || new Animated.Value(0)).interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50]
                  }) }
                ],
                opacity: fadeAnim,
              }
            ]}>
              <Image source={aletheiaLogo} style={styles.likeIcon} />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userAge}>{item.age} years old</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${(videoStatus[index]?.progress || 0) * 100}%` 
                }
              ]} 
            />
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: {
    viewableItems: Array<{
      item: any;
      key: string;
      index: number | null;
      isViewable: boolean;
      section?: any;
    }>;
    changed: Array<{
      item: any;
      key: string;
      index: number | null;
      isViewable: boolean;
      section?: any;
    }>;
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveVideoIndex(viewableItems[0].index);
      if (!manuallyPaused[viewableItems[0].index]) {
        setVideoStatus(prev => ({
          ...prev,
          [viewableItems[0].index!]: {
            ...prev[viewableItems[0].index!],
            isPlaying: true
          }
        }));
      }
    }
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={videos}
      renderItem={renderVideoItem}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50
      }}
      removeClippedSubviews={true}
      initialNumToRender={1}
      maxToRenderPerBatch={2}
      windowSize={3}
      getItemLayout={(data, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
      decelerationRate="fast"
      snapToInterval={height}
      snapToAlignment="start"
    />
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // iconContainer: {
  //   position: 'absolute',
  //   right: 20,
  //   top: '50%',
  //   transform: [{ translateY: -((iconSize + iconMargin) * 1.5) }],
  // },
  iconBox: {
    width: iconSize,
    height: iconSize,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    marginBottom: iconMargin,
    borderRadius: 10, // Rounded corners
  },
  likeAnimation: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
  likeIcon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: '100%',
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
  },
  userInfo: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 70 : 60,
    left: 20,
    zIndex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userAge: {
    color: 'white',
    fontSize: 16,
  },
});
