import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { useGlobalState } from '@/context/GlobalStateContext';
import { ThemedText } from '../../components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import VideoOverlay from '../../components/VideoOverlay';
import { videos } from './profiles'; // Import the videos array from profiles
import MessagePopup from '../../components/MessagePopup';

// Add this type definition at the top of your file, after the imports
type Connection = { id: number; name: string; };

export default function ConnectionsTab() {
  const { connections } = useGlobalState();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [selectedConnectionForMessage, setSelectedConnectionForMessage] = useState<Connection | null>(null);

  const handleSchedule = (connection: Connection) => {
    setSelectedConnection(connection);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && selectedConnection) {
      console.log(`Scheduled for ${selectedConnection.name}: ${selectedDate}`);
      // Here you can implement the logic to save the scheduled date
    }
  };

  const handleReplay = (connection: Connection) => {
    const video = videos.find(v => v.id === connection.id);
    if (video) {
      setSelectedVideo(video.source);
      setShowVideoOverlay(true);
    }
  };

  const handleMessage = (connection: Connection) => {
    setSelectedConnectionForMessage(connection);
    setShowMessagePopup(true);
  };

  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <View style={styles.connectionRow}>
      <ThemedText>{item.name}</ThemedText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleReplay(item)}
        >
          <Ionicons name="play-circle-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleSchedule(item)}
        >
          <Ionicons name="calendar-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleMessage(item)}
        >
          <Ionicons name="chatbubble-outline" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Connections</Text>
      </View>
      <View style={styles.container}>
        {connections.length > 0 ? (
          <FlatList
            data={connections}
            renderItem={renderConnectionItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text style={styles.emptyText}>No connections yet. Double tap videos to add them here!</Text>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      {showVideoOverlay && selectedVideo && (
        <VideoOverlay
          videoSource={selectedVideo}
          onClose={() => setShowVideoOverlay(false)}
        />
      )}
      {showMessagePopup && selectedConnectionForMessage && (
        <MessagePopup
          connection={selectedConnectionForMessage}
          onClose={() => setShowMessagePopup(false)}
        />
      )}
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
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%', // Adjust this value to ensure proper spacing
  },
  iconButton: {
    padding: 10,
  },
});
