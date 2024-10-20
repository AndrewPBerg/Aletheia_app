import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Platform, Button } from 'react-native';
import { useGlobalState } from '@/context/GlobalStateContext';
import { ThemedText } from '../../components/ThemedText';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import VideoOverlay from '../../components/VideoOverlay';
import VideoCall from '../../components/VideoCall';
import MessagePopup from '../../components/MessagePopup'; // Import MessagePopup
import { videos } from './profiles'; // Import the videos array from profiles

// Import the Connection type from your global state
import { Connection as GlobalConnection } from '@/context/GlobalStateContext';

// Update the local Connection type
type Connection = GlobalConnection & {
  preferredTime: string;
  videoCallCompleted: boolean; // New property
};

export default function ConnectionsTab() {
  const { connections: globalConnections } = useGlobalState();

  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // Initialize connections with videoCallCompleted property
    setConnections(
      (globalConnections as Connection[]).map(conn => ({
        ...conn,
        videoCallCompleted: false,
        preferredTime: conn.preferredTime || '' // Ensure preferredTime exists
      }))
    );
  }, [globalConnections]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showScheduleOverlay, setShowScheduleOverlay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentVideoCallConnection, setCurrentVideoCallConnection] = useState<Connection | null>(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [selectedMessageConnection, setSelectedMessageConnection] = useState<Connection | null>(null);

  const handleSchedule = (connection: Connection) => {
    setSelectedConnection(connection);
    setShowScheduleOverlay(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowTimePicker(false);
    setDate(currentDate);
  };

  const handleReplay = (connection: Connection) => {
    const video = videos.find(v => v.id === connection.id);
    if (video) {
      setSelectedVideo(video.source);
      setShowVideoOverlay(true);
    }
  };

  const handleVideoCall = (connection: Connection) => {
    setCurrentVideoCallConnection(connection);
    setShowVideoCall(true);
  };

  const handleVideoCallEnd = () => {
    if (currentVideoCallConnection) {
      setConnections(prevConnections =>
        prevConnections.map(conn =>
          conn.id === currentVideoCallConnection.id
            ? { ...conn, videoCallCompleted: true }
            : conn
        )
      );
    }
    setShowVideoCall(false);
    setCurrentVideoCallConnection(null);
  };

  const handleMessage = (connection: Connection) => {
    setSelectedMessageConnection(connection);
    setShowMessagePopup(true);
  };

  const handleCloseMessagePopup = () => {
    setShowMessagePopup(false);
    setSelectedMessageConnection(null);
  };

  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <View style={styles.connectionRow}>
      <ThemedText>{item.name}</ThemedText>
      <View style={styles.buttonContainer}>
        {item.videoCallCompleted ? (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => handleMessage(item)}
          >
            <Ionicons name="chatbubble-outline" size={24} color="blue" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => handleVideoCall(item)}
          >
            <Ionicons name="videocam-outline" size={24} color="blue" />
          </TouchableOpacity>
        )}
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
      </View>
    </View>
  );

  const userVideoSource = require('../../assets/video_profiles/benket_chat.mp4');
  const connectionVideoSource = require('../../assets/video_profiles/anya_chat.mp4');

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
      </View>
      {showVideoOverlay && selectedVideo && (
        <VideoOverlay
          videoSource={selectedVideo}
          onClose={() => setShowVideoOverlay(false)}
        />
      )}
      <Modal
        transparent={true}
        visible={showScheduleOverlay}
        onRequestClose={() => setShowScheduleOverlay(false)}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <Text style={styles.overlayTitle}>Schedule with {selectedConnection?.name}</Text>
            <Text style={styles.preferredTimeText}>
              Preferred Time: {selectedConnection?.preferredTime}
            </Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={date}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            ) : (
              <>
                <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
                <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScheduleOverlay(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      {showVideoCall && currentVideoCallConnection && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={showVideoCall}
          onRequestClose={handleVideoCallEnd}
        >
          <VideoCall
            userVideo={userVideoSource}
            connectionVideo={connectionVideoSource}
            onClose={handleVideoCallEnd}
          />
        </Modal>
      )}
      {showMessagePopup && selectedMessageConnection && (
        <MessagePopup
          connection={selectedMessageConnection}
          onClose={handleCloseMessagePopup}
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
    width: '60%', // Increased width to accommodate the new button
  },
  iconButton: {
    padding: 10,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  preferredTimeText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
