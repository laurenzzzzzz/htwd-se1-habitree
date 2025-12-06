/**
 * Domain Module Export
 * 
 * Zentrale Export-Datei für das Habit-Domain-Modul
 * Nach DDD-Prinzip: Domain-Logik ist unabhängig von Framework/Infrastruktur
 */

export { 
  HabitService, 
  type Habit, 
  type HabitEntry, 
  type ValidationResult 
} from './Habit';
