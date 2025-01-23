import * as SQLite from 'expo-sqlite';
import { Medication } from '../types/Medication';

export class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabase('meditrack.db');
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS medications (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          dosage REAL NOT NULL,
          unit TEXT NOT NULL,
          frequency TEXT NOT NULL,
          mealTiming TEXT NOT NULL,
          startDate INTEGER NOT NULL,
          endDate INTEGER NOT NULL,
          currentStock REAL NOT NULL,
          lowStockThreshold REAL NOT NULL
        )`
      );
    });
  }

  async addMedication(medication: Medication): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO medications 
          (id, name, dosage, unit, frequency, mealTiming, 
           startDate, endDate, currentStock, lowStockThreshold) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            medication.id,
            medication.name,
            medication.dosage,
            medication.unit,
            medication.frequency,
            medication.mealTiming,
            medication.startDate.getTime(),
            medication.endDate.getTime(),
            medication.currentStock,
            medication.lowStockThreshold,
          ],
          (_, result) => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getAllMedications(): Promise<Medication[]> {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM medications',
          [],
          (_, { rows }) => {
            const medications: Medication[] = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              medications.push({
                ...item,
                startDate: new Date(item.startDate),
                endDate: new Date(item.endDate),
              });
            }
            resolve(medications);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Add additional methods for updating and deleting medications
}