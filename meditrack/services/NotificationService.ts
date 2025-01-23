import * as Notifications from 'expo-notifications';
import { Medication } from '../types/Medication';

export class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async scheduleMedicationReminders(medication: Medication) {
    // Cancel previous notifications for this medication
    await Notifications.cancelAllScheduledNotificationsAsync();

    medication.reminderTimes.forEach(async (time) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for ${medication.name}`,
          body: `Take ${medication.dosage} ${medication.unit} ${medication.mealTiming} meal`,
          sound: true,
        },
        trigger: {
          date: time,
          repeats: true,
        },
      });
    });
  }

  async checkLowStock(medication: Medication) {
    if (medication.currentStock <= medication.lowStockThreshold) {
      await Notifications.presentNotificationAsync({
        title: 'Low Stock Alert',
        body: `${medication.name} is running low. Reorder soon!`,
        sound: true,
      });
    }
  }
}
