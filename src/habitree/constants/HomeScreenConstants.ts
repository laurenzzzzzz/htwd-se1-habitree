/**
 * Home Screen Constants
 * Domain-level constants for the home screen
 */

export type FilterKey = 'alle' | 'klimmzuege' | 'liegestuetze' | 'schritte';

export const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'klimmzuege', label: 'Klimmzüge' },
  { key: 'liegestuetze', label: 'Liegestütze' },
  { key: 'schritte', label: 'Schritte' },
];

export const CHART_MAP: Record<FilterKey, any> = {
  alle: require('@/assets/images/chart1.png'),
  klimmzuege: require('@/assets/images/chart2.png'),
  liegestuetze: require('@/assets/images/chart3.png'),
  schritte: require('@/assets/images/chart4.png'),
};

export const PREDEFINED_HABITS = [
  { id: 1, label: '6000 Schritte', description: 'Gehe heute mindestens 6000 Schritte.', frequency: 'Täglich' },
  { id: 2, label: '1,5h Uni', description: 'Verbringe 1,5 Stunden mit Uni-Aufgaben.', frequency: 'Wöchentlich' },
  { id: 3, label: '40 Liegestütze', description: 'Mache 40 saubere Liegestütze.', frequency: '2x Pro Woche' },
  { id: 4, label: '10 Klimmzüge', description: 'Schaffe heute 10 Klimmzüge.', frequency: '3x Pro Woche' },
];

export const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
