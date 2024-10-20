import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useGlobalState } from '@/context/GlobalStateContext';

const { width } = Dimensions.get('window');

export default function ConnectionsTab() {
  const { likedVideos } = useGlobalState();

  const renderVideoItem = ({ item }: { item: string }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        useNativeControls
        isLooping
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {likedVideos.length > 0 ? (
        <FlatList
          data={likedVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      ) : (
        <Text style={styles.emptyText}>No connections yet. Double tap videos to add them here!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  videoContainer: {
    width: width / 2 - 15,
    height: 200,
    margin: 5,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
