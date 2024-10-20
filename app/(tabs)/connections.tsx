import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useGlobalState } from '@/context/GlobalStateContext';

export default function ConnectionsTab() {
  const { likedVideos } = useGlobalState();

  const renderVideoItem = ({ item }: { item: string }) => (
    <View style={styles.videoContainer}>
      <Text style={styles.videoName}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Connections</Text>
      </View>
      <View style={styles.container}>
        {likedVideos.length > 0 ? (
          <FlatList
            data={likedVideos}
            renderItem={renderVideoItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.emptyText}>No connections yet. Double tap videos to add them here!</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingTop: 40, // Added top padding to lower the title
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  videoName: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
