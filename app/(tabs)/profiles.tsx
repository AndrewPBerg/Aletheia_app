import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Animated } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useGlobalState } from '@/context/GlobalStateContext';

const { width, height } = Dimensions.get('window');
const iconSize = 50; // Size of each icon box
const iconMargin = 10; // Margin between icon boxes

export const videos = [
  { id: 1, name: 'Demo Video 1', source: require('../../assets/video_profiles/demoVideo1.mp4') },
  { id: 2, name: 'Demo Video 2', source: require('../../assets/video_profiles/demoVideo2.mp4') },
  { id: 3, name: 'Demo Video 3', source: require('../../assets/video_profiles/demoVideo3.mp4') },
];

export default function ProfilesTab() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState<{ [key: number]: boolean }>({});
  const [likedVideos, setLikedVideos] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef(null);
  const videoRefs = useRef<{ [key: number]: Video | null }>({});
  const doubleTapRef = useRef<{ [key: number]: NodeJS.Timeout | null }>({});
  const likeAnimationRef = useRef<{ [key: number]: Animated.Value }>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { addLikedVideo, addConnection } = useGlobalState();

  useEffect(() => {
    Object.keys(likedVideos).forEach((index) => {
      if (likedVideos[Number(index)]) {
        fadeInAndOut(Number(index));
      }
    });
  }, [likedVideos]);

  const togglePlayPause = (index: number) => {
    if (videoRefs.current[index]) {
      if (videoStatus[index]) {
        videoRefs.current[index]?.pauseAsync();
      } else {
        videoRefs.current[index]?.playAsync();
      }
      setVideoStatus(prev => ({ ...prev, [index]: !prev[index] }));
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

  const renderVideoItem = ({ item, index }: { item: { name: string; source: any }; index: number }) => (
    <View style={styles.videoContainer}>
      <TouchableWithoutFeedback onPress={() => handleDoubleTap(index)}>
        <View style={styles.videoWrapper}>
          <Video
            ref={(ref) => { videoRefs.current[index] = ref; }}
            source={item.source}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay={index === activeVideoIndex && videoStatus[index] !== false}
            isLooping={true}
            style={styles.video}
            useNativeControls={false}
            onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
              if (status.isLoaded) {
                setVideoStatus(prev => ({ ...prev, [index]: status.isPlaying }));
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
              <View style={styles.likeIcon} />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {/* <View style={styles.iconContainer}>
        <View style={styles.iconBox} />
        <View style={styles.iconBox} />
        <View style={styles.iconBox} />
      </View> */}
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
      setVideoStatus(prev => ({ ...prev, [viewableItems[0].index!]: true }));
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
    width: 80,
    height: 80,
    backgroundColor: 'red', // You can change this color
    borderRadius: 40, // This makes it circular
  },
});
