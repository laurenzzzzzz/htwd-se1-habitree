export type HabitEntry = {
  id: number;
  date: string; // ISO date
  status: boolean;
  note: string | null;
};

export type Habit = {
  id: number;
  name: string;
  description: string;
  frequency: string;
  entries: HabitEntry[];
};

export default Habit;
