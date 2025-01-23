import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Medication } from '../types/Medication';

const MedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.number().positive('Dosage must be positive'),
  unit: z.enum(['pill', 'ml', 'mg']),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  mealTiming: z.enum(['before', 'after', 'with', 'anytime']),
  startDate: z.date(),
  endDate: z.date(),
  currentStock: z.number().positive('Stock must be positive'),
  lowStockThreshold: z.number().positive('Threshold must be positive'),
});

interface MedicationFormProps {
  onSubmit: (data: Medication) => void;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({ onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<Medication>({
    resolver: zodResolver(MedicationSchema),
  });

  const handleFormSubmit = (data: Medication) => {
    // Generate a unique ID and submit the medication
    const medicationWithId = {
      ...data,
      id: Date.now().toString(),
      reminderTimes: [], // To be implemented in a future version
    };
    onSubmit(medicationWithId);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Medication Name"
            value={value}
            onChangeText={onChange}
            error={!!errors.name}
          />
        )}
      />
      <Controller
        control={control}
        name="dosage"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Dosage"
            value={value ? value.toString() : ''}
            onChangeText={(text) => onChange(parseFloat(text))}
            keyboardType="numeric"
            error={!!errors.dosage}
          />
        )}
      />
      {/* Add additional form fields for unit, frequency, meal timing, start/end date, stock, and low stock threshold */}
      <Button mode="contained" onPress={handleSubmit(handleFormSubmit)}>
        Add Medication
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});