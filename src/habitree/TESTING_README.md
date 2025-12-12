# Habitree - Testing Guide

## Testpyramide

```
        ┌─────────────┐
        │  System     │  10% - Manuell
        │   Tests     │  
        ├─────────────┤
        │ Integration │  20% - Service + Repository
        │   Tests     │  (12 Tests)
        ├─────────────┤
        │             │
        │    Unit     │  70% - Domain Logic
        │    Tests    │  (22 Tests)
        │             │
        └─────────────┘
```

## Struktur

```
__tests__/
├── domain/
│   └── Habit.entity.test.ts          # Unit Tests (22)
│
└── integration/
    ├── HabitSchedulePolicy.test.ts      # Domain policy coverage
    └── HabitService.integration.test.ts # Service + Repository
```

## Tests ausführen

```bash
# Alle Tests
npm test

# Mit Coverage
npm run test:coverage

# Watch Mode
npm run test:watch
```

## Was wird getestet?

### Unit Tests (22 Stück)
Testet: `domain/entities/Habit.ts`

| Methode | Tests | Testmethode |
|---------|-------|-------------|
| `getStreak()` | 6 | Grenzwertanalyse |
| `isCompletedToday()` | 4 | Äquivalenzklassen |
| `getCompletionRate()` | 5 | Grenzwerte (0%, 50%, 100%) |
| `hasMilestone()` | 3 | 7-Tage, 30-Tage |
| `Constructor` | 2 | Objekterstellung |

### Integration Tests (13 Stück)
Testet: 
- `application/services/HabitService.ts` + Repository + Entity
- `domain/services/HabitSchedulePolicy.ts` (Policy bleibt konsistent)

| Flow/Testblock | Tests | Was wird geprüft? |
|----------------|-------|-------------------|
| `fetchHabits` | 4 | Service → Repository → Entity |
| `saveHabit` | 3 | Validierung → Speichern → Liste |
| `toggleHabit` | 4 | Status-Änderung + Default-Datum |
| E2E Workflow | 2 | Erstellen → Abhaken → Streak |
| `HabitSchedulePolicy` | 4 | Defaults + Frequenzlogik |

### Systemtests (4 Stück - manuell)
Siehe: `__tests__/system/SYSTEMTESTS.md`

Login, CRUD, Streak, Validierung - vor Release durchklicken.

## Für den Fachaustausch

**Frage 1: Testorganisation**
- 70% Unit / 20% Integration / 10% System
- Entwickler: Unit Tests vor Commit
- Tech Lead: Integration Tests
- Team: Manuelle Systemtests

**Frage 2: Methoden & Werkzeuge**
- Jest + jest-expo
- Mock-Repositories
- Äquivalenzklassen, Grenzwertanalyse

**Frage 3: Gefundene Fehler**
1. Streak bei Mitternacht fehlerhaft (isSameDay)
2. Leere Habit-Namen akzeptiert
3. Toggle-Status nicht korrekt aktualisiert

---
**Team T3A - Habitree** | HTW Dresden
