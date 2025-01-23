import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MedicationForm } from '../components/MedicationForm';
import { DatabaseService } from '../services/DatabaseService';
import { NotificationService } from '../services/NotificationService';
import { Medication } from '../types/Medication';

export default function HomeScreen() {
  const [showForm, setShowForm] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const dbService = new DatabaseService();
  const notificationService = new NotificationService();

  useEffect(() => {
    // Fetch all medications from the database when the component mounts
    const fetchMedications = async () => {
      try {
        const allMedications = await dbService.getAllMedications();
        setMedications(allMedications);
      } catch (error) {
        console.error('Error fetching medications:', error);
      }
    };
    fetchMedications();
  }, [dbService]);

  const handleMedicationSubmit = async (medication: Medication) => {
    try {
      // Request notification permissions
      const permissionGranted = await notificationService.requestPermissions();

      if (permissionGranted) {
        // Save the new medication to the database
        await dbService.addMedication(medication);

        // Schedule reminders for the new medication
        await notificationService.scheduleMedicationReminders(medication);

        // Update the medications state to include the new medication
        setMedications([...medications, medication]);

        // Reset the form
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!showForm ? (
        <>
          <Button
            mode="contained"
            onPress={() => setShowForm(true)}
          >
            Add New Medication
          </Button>
          {medications.length > 0 ? (
            <FlatList
              data={medications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.medicationItem}>
                  <Text>{item.name}</Text>
                  <Text>Dosage: {item.dosage} {item.unit}</Text>
                  <Text>Frequency: {item.frequency}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noMedicationsText}>
              No medications added yet. Click the "Add New Medication" button to get started.
            </Text>
          )}
        </>
      ) : (
        <MedicationForm onSubmit={handleMedicationSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  medicationItem: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
  },
  noMedicationsText: {
    textAlign: 'center',
    marginTop: 16,
  },
});