export interface Medication {
    id: string;
    name: string;
    dosage: number;
    unit: 'pill' | 'ml' | 'mg';
    frequency: 'daily' | 'weekly' | 'custom';
    mealTiming: 'before' | 'after' | 'with' | 'anytime';
    startDate: Date;
    endDate: Date;
    reminderTimes: Date[];
    currentStock: number;
    lowStockThreshold: number;
  }