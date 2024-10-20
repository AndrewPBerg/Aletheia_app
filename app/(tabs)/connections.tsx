import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useGlobalState } from '@/context/GlobalStateContext';
import { Link } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
// Import DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';
import { videos } from './profiles'; // Import the videos array

// Add this type definition at the top of your file, after the imports
type Connection = { id: number; name: string; source: any };

export default function ConnectionsTab() {
  const { connections } = useGlobalState();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const handleSchedule = (connection: Connection) => {
    setSelectedConnection(connection);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: Event, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && selectedConnection) {
      console.log(`Scheduled for ${selectedConnection.name}: ${selectedDate}`);
      // Here you can implement the logic to save the scheduled date
    }
  };

  const renderConnectionItem = ({ item }: { item: Connection }) => (
    <View style={styles.connectionRow}>
      <ThemedText>{item.name}</ThemedText>
      <View style={styles.buttonContainer}>
        <Link href={{ pathname: "/profiles", params: { id: item.id } }} asChild>
          <Button title="View Profile" />
        </Link>
        <Button 
          title="Schedule" 
          onPress={() => handleSchedule(item)}
        />
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
  },
});
