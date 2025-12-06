# Habitree - Domain Driven Design Tests

## Projektstruktur (DDD)

```
habitree/
├── domain/                    # 🏛️ DOMAIN LAYER (Business-Logik)
│   └── habit/
│       ├── Habit.ts           # Entity, Value Objects, Domain Service
│       └── index.ts           # Module Exports
│
├── __tests__/                 # 🧪 TESTS
│   └── domain/
│       └── HabitService.test.ts   # Unit Tests für Domain-Logik
│
├── app/                       # 📱 UI Layer (React Native)
├── components/                # UI Components
├── context/                   # React Context (Application Layer)
├── hooks/                     # Custom Hooks
│
├── jest.config.js             # Jest Konfiguration
└── package.json               # Dependencies & Scripts
```

## DDD-Konzepte erklärt

### Domain Layer (`domain/`)
- **Entities**: Objekte mit Identität (z.B. `Habit` mit ID)
- **Value Objects**: Immutable Objekte ohne Identität (z.B. `HabitEntry`, `ValidationResult`)
- **Domain Services**: Business-Logik die nicht zu einer Entity gehört (`HabitService`)

### Warum DDD für Tests?
1. **Isolierte Business-Logik** → Leicht testbar
2. **Unabhängig von Framework** → Tests laufen ohne React Native
3. **Klare Verantwortlichkeiten** → Jede Komponente hat eine Aufgabe

## Tests ausführen

```bash
# 1. Dependencies installieren
npm install

# 2. Alle Tests ausführen
npm test

# 3. Tests im Watch-Mode (bei Änderungen neu ausführen)
npm run test:watch

# 4. Tests mit Coverage-Report
npm run test:coverage
```

## Testübersicht

| Test | Beschreibung | Testmethode |
|------|-------------|-------------|
| `isSameDay` | Datumsvergleich | Grenzwertanalyse (Mitternacht) |
| `calculateStreak` | Streak-Berechnung | Äquivalenzklassen, Grenzwerte |
| `validateHabit` | Eingabevalidierung | Äquivalenzklassen (gültig/ungültig) |
| `isHabitCompletedToday` | Tagesprüfung | Positive/Negative Tests |
| `filterHabits` | Suchfilter | Teilübereinstimmung, Edge Cases |
| `calculateTotalStreak` | Gesamt-Streak | Kombinatorik |

## Domain Service in der App verwenden

```typescript
// In deiner React Native Komponente:
import { HabitService } from '@/domain/habit';

// Streak berechnen
const streak = HabitService.calculateStreak(habit.entries);

// Habit validieren
const { isValid, errorMessage } = HabitService.validateHabit(name, description);
if (!isValid) {
  Alert.alert('Fehler', errorMessage);
  return;
}

// Prüfen ob heute erledigt
const completedToday = HabitService.isHabitCompletedToday(habit);
```

## Integration in index.tsx

Um die Domain-Logik in der App zu verwenden, ersetze die hardcoded Werte:

```typescript
// VORHER (hardcoded):
<ThemedText style={styles.streakNumber}>14</ThemedText>

// NACHHER (berechnet):
import { HabitService } from '@/domain/habit';

// Im Component:
const streak = HabitService.calculateTotalStreak(habits);

// Im JSX:
<ThemedText style={styles.streakNumber}>{streak}</ThemedText>
```

## Für den Fachaustausch

Diese Tests demonstrieren:
1. ✅ **Unit Tests** (70%) - Domain-Logik isoliert getestet
2. ✅ **Testmethoden** - Äquivalenzklassen, Grenzwertanalyse, Negativtests
3. ✅ **DDD-Prinzipien** - Saubere Trennung von Business-Logik
4. ✅ **FIRST-Prinzip** - Fast, Isolated, Repeatable, Self-validating, Timely

---

**Team T3A - Habitree** | Software Engineering I | HTW Dresden
