# Habitree Architecture – Domain-Driven Design (DDD)

## Überblick

Das Habitree-Projekt folgt den Prinzipien des **Domain-Driven Design (DDD)** mit einer klaren Trennung der Aufgabenbereiche über vier Architekturschichten hinweg:

- **Domäne** – Kerngeschäftslogik, Entitäten und Repository-Schnittstellen
- **Anwendung** – Use-Case-Services, die die Domänenlogik steuern
- **Infrastruktur** – Adapter für externe Systeme (HTTP, Persistenz, DI)
- **Präsentation** – React Native UI-Komponenten, Bildschirme und Controller

Dieses Dokument beschreibt die Ordnerstruktur, die Verantwortlichkeiten jeder Schicht und Richtlinien für Mitwirkende.
---

## Ordnerstruktur

```
src/habitree/
├── domain/                           # Domänenschicht
│   ├── entities/                     # Kerndomänenentitäten
│   │   ├── User.ts
│   │   ├── Habit.ts
│   │   ├── Quote.ts
│   │   └── Entry.ts
│   └── repositories/                 # Repository-Schnittstellen (Verträge)
│       ├── IAuthRepository.ts
│       ├── IHabitsRepository.ts
│       ├── IQuotesRepository.ts
│       ├── IProfileRepository.ts
│       └── IAuthApiRepository.ts
│
├── application/                      # Anwendungsschicht
│   ├── services/                     # Orchestrierung von Anwendungsfällen
│   │   ├── AuthService.ts            # Domänenlogik für die Authentifizierung
│   │   ├── AuthenticationService.ts  # Anmelde-/Registrierungsablauf
│   │   ├── HabitService.ts           # Habit CRUD + Orchestrierung
│   │   ├── QuoteService.ts           # Abrufen von Zitaten
│   │   └── ProfileService.ts         # Aktualisierungen des Benutzerprofils
│   └── types/
│       └── ApplicationServices.ts    # Gemeinsamer DI-Vertrag
│
├── infrastructure/                   # Infrastruktur-Ebene
│   ├── adapters/                     # Externe Systemadapter
│   │   ├── ApiHabitsRepository.ts    # HTTP: habits Endpunkt
│   │   ├── ApiAuthRepository.ts      # HTTP: auth Endpunkt
│   │   ├── ApiQuotesRepository.ts    # HTTP: quotes Endpunkt
│   │   ├── ApiProfileRepository.ts   # HTTP: profile Endpunkt
│   │   └── SecureStoreAuthRepository.ts  # Lokale sichere Persistenz
│   └── di/                           # Abhängigkeitsinjektion
│       └── ServiceContainer.ts       # Erstellt Repositorys und Dienste
│
├── presentation/                     # Präsentationsschicht
│   ├── providers/                    # React-provider für Dienste/DI
│   │   └── ApplicationServicesProvider.tsx
│   ├── controllers/                  # Smart hooks, die die Benutzeroberfläche mit Diensten verbinden
│   │   ├── useAuthController.tsx
│   │   ├── useHabitsController.tsx
│   │   ├── useQuoteController.tsx
│   │   └── useProfileController.tsx
│   └── ui/                           # Präsentationskomponenten
│       ├── QuoteBanner.tsx
│       ├── HabitList.tsx
│       ├── AuthForm.tsx
│       ├── ProfileSettings.tsx
│       ├── CalendarView.tsx
│       ├── TreeView.tsx
│       ├── InventoryView.tsx
│       ├── HabitModal.tsx
│       └── ui/                       # Gemeinsame Grundelemente auf niedriger Ebene (IconSymbol, TabBar Hintergrund)
│
├── app/                              # Expo Router Bildschirme
│   ├── _layout.tsx                   # Root layout & tab navigator
│   ├── (auth)/
│   │   └── login.tsx                 # Auth-Bildschirm (verwendet LoginController)
│   └── (tabs)/
│       ├── index.tsx                 # Startbildschirm (habits, Zitate)
│       ├── calendar.tsx              # Kalenderbildschirm
│       ├── tree.tsx                  # Baumbildschirm (Belohnungen)
│       ├── inventory.tsx             # Inventarbildschirm (items)
│       └── profile.tsx               # Profilbildschirm  (Einstellungen, Benutzerinformationen)
│
├── context/                          # Global state & auth context
│   └── AuthContext.tsx               # Auth state, persistence adapter composition
│
├── styles/                           # StyleSheet definitions
├── constants/                        # Globale Konstanten
├── hooks/                            # Generic custom hooks


```

---

## Layer Responsibilities

### 1. Domänenschicht -- Domain Layer  (`domain/`)

**Zweck:** Definition der zentralen Geschäftskonzepte und -regeln unabhängig von Frameworks oder Technologien.

**Inhalt:**
- **Entities** (`domain/entities/`)
  - `User.ts` –  Benutzerprofildaten (ID, Benutzername, E-Mail) mit Validierungsmethoden
  - `Habit.ts` –  Gewohnheitsdefinition und Tracking-Daten mit Geschäftslogik (Berechnung der Streak, Abschlussrate)
  - `Quote.ts` – Tägliches Motivationszitat mit Hilfsmethoden
  - `TreeGrowth.ts` – Fortschritt des Benutzers basierend auf der Gewohnheitserfüllung (0–100 %)
  - `Achievement.ts` – Vom Benutzer verdiente Abzeichen/Erfolge
  - `Streak.ts` – Aktuelle und längste Serie des Benutzers mit Meilenstein-Verfolgung
  - `Entry.ts` – Eintrag zur Habit Erfüllung für ein bestimmtes Datum

- **Repository Schnittstellen** (`domain/repositories/`)
  - Definition von Schnittstellen, die von den unteren Schichten implementiert werden müssen
  - Beispiel: `IHabitsRepository` declares `getHabits()`, `saveHabit()`, `toggleHabit()`
  - `IAuthApiRepository` – Authentifizierungsendpunkte
  - `IHabitsRepository` – Habit CRUD und Tracking
  - `IQuotesRepository` – Tägliche Zitate
  - `IProfileRepository` – Aktualisierungen des Benutzerprofils
  - `IAuthRepository` – Lokale Authentifizierungspersistenz
  - `ITreeGrowthRepository` – Berechnungen zum Baumwachstum
  - `IAchievementRepository` – Erfolgssystem/Abzeichensystem
  - `IStreakRepository` – Verfolgung der Streak
  - Keine Implementierungsdetails; reine TypeScript-Schnittstellen

**Wichtige Regeln:**
- Keine Importe aus  `application/`, `infrastructure/`, oder `presentation/`
- Fokus auf Datenstrukturen und Geschäftslogik-Verträgen
- Vorzugsweise unveränderlich; gegebenenfalls schreibgeschützte Felder verwenden

---

### 2. Anwendungsschicht -- Application Layer (`application/services/`)

**Zweck:** Koordinierung der Domänenlogik und der Anwendungsfälle; fungiert als Brücke zwischen Präsentation und Domäne.

**Inhalt:**
- **Service Classes** – Implementierung von Anwendungsfällen durch Aufruf von Repositorys und Domänenlogik
  - `AuthService` – Verwaltet den Authentifizierungsstatus und die lokale Beständigkeit (SecureStore)
  - `AuthenticationService` – Verarbeitet den Anmelde-/Registrierungsablauf
  - `HabitService` – CRUD-Operationen für habits
  - `QuoteService` – Ruft tägliche Zitate ab und speichert sie im Cache
  - `ProfileService` – Aktualisiert das Benutzerprofil und das Passwort.
  - `TreeGrowthService` – Berechnet und ruft den Fortschritt des Baums ab.
  - `AchievementService` – Ruft freigeschaltete Erfolge ab.
  - `StreakService` – Tracked aktuelle und längste Serien.

**Beispielablauf:**
```typescript
// ProfileService.updateUsername(authToken, newUsername)
// 1. Empfängt Benutzeranfrage über Controller-Hook.
// 2. Ruft profileRepository.updateUsername() (HTTP-Adapter) auf.
// 3. Gibt aktualisierte Benutzereinheit zurück.
// 4. Controller aktualisiert Status und rendert neu.
```
**Wichtige Regeln:**
- Abhängigkeit von Domänenentitäten und Repository-Schnittstellen (nicht von Implementierungen)
- Keine direkten HTTP-Aufrufe; Verwendung von eingefügten Repository-Adaptern
- Dienste sind zustandslos; Zustand wird von Controllern oder Kontext verwaltet

---

### 3. Infrastruktur-Ebene -- Infrastructure Layer (`infrastructure/`)

**Zweck:** Implementierung externer Systemadapter und Bereitstellung von Dependency Injection.

**Inhalt:**

- **HTTP Adapters** (`infrastructure/adapters/`)
  - `ApiHabitsRepository.ts` – axios calls to `/habits` endpoint
  - `ApiAuthRepository.ts` – axios calls to `/auth` endpoint
  - `ApiQuotesRepository.ts` – axios calls to `/quotes` endpoint
  - `ApiProfileRepository.ts` – axios calls to `/user` endpoint
  - `ApiTreeGrowthRepository.ts` – Daten und Berechnungen zum Baumwachstum
  - `ApiAchievementRepository.ts` – Erfolge/Abzeichen endpoints
  - `ApiStreakRepository.ts` – streak tracking endpoints
  - Alle Adapter implementieren Domänen-Repository-Schnittstellen

- **Persistenzadapter**
  - `SecureStoreAuthRepository.ts` – Uses `expo-secure-store` um auth token und Benutzerdaten lokal zu speichern

- **DI Composition Root** (`infrastructure/di/ServiceContainer.ts`)
  - Exportiert Einzelinstanzen aller Dienste
  - Verbindet Repositorys mit Diensten
  - Beispiel:
    ```typescript
    export const authService = new AuthService(secureStoreAuthRepo);
    export const habitService = new HabitService(apiHabitsRepo);
    ```
    
**Wichtige Regeln:**
- Einziger Ort, an dem direkte axios/SecureStore calls erfolgen
- Alle HTTP-Header, die Fehlerbehandlung und die Einfügung von auth token erfolgen hier
- Die Verwendung neuer externer Bibliotheken sollte in einen Adapter eingebunden werden

---

### 4. Präsentationsschicht -- Presentation Layer (`presentation/`)

**Zweck:** Rendern der Benutzeroberfläche (UI) und Verwalten des lokalen Komponentenzustands über Controller.

**Inhalt:**

- **Controller Hooks** (`presentation/controllers/`)
  - Intelligente Hooks, die services und UI-Komponenten verbinden
  - Verwalten von Ladezuständen, Fehlern und lokalem UI-Status
  - `useAuthController()` – Koordination von Anmeldung/Registrierung
  - `useHabitsController()` – Habit  CRUD und Filterung
  - `useQuoteController()` – Abrufen täglicher Zitate
  - `useProfileController()` – Aktualisierungen des Benutzerprofils
  - `useTreeGrowthController()` – Baumwachstumsdaten und -anzeige
  - `useAchievementController()` – Freischalten von Erfolgen/Abzeichen
  - `useStreakController()` – Streak-Daten und Meilensteine
  - `useCalendarStatsController()` –  Wöchentliche Abschlussstatistiken

- **Präsentationskomponenten** (`presentation/ui/`)
  - Einfache, wiederverwendbare UI-Komponenten
  - Empfangen von props und Ausgeben von callbacks; keine Geschäftslogik
  - Grundlegende Komponenten: `ThemedText`, `ThemedView`, `HelloWave`, `Collapsible`, `HapticTab`, `ExternalLink`, `ParallaxScrollView`
  - UI Komponenten: `AuthForm`, `HabitList`, `QuoteBanner`, `ProfileSettings`, `HabitModal`
  - Funktionsbildschirme: `CalendarView` (mit wöchentlichen Statistiken), `TreeView` (mit Wachstumsanzeige), `InventoryView` (mit Erfolgen)

**Beispielmuster:**
```tsx
// Screen (e.g., index.tsx)
export default function HomeScreen() {
  const { habits, isLoading, fetchHabits } = useHabitsController();
  
  return (
    <HabitList habits={habits} onToggle={(id) => toggleHabitHandler(id)} />
  );
}
```

**Wichtige Regeln:**
- Controller koordinieren Dienste; Komponenten dienen nur der Darstellung.
- Komponenten akzeptieren props und callbacks; keine direkten Dienstaufrufe.
- Minimieren Sie das erneute Rendern von Komponenten mit `useMemo` und `useCallback`.

---

### 5. Globaler Status und Kontext -- Global State & Context (`context/`)

**Zweck:** Verwalten des Authentifizierungsstatus und Bereitstellen eines app-weiten Identitätskontexts.

**Inhalt:**
- `AuthContext.tsx`
  - Löst `AuthService` via `useApplicationServices()`
  - Speichert auth token via `SecureStoreAuthRepository`
  - Stellt  `isLoggedIn`, `currentUser`, `authToken`, `signOut()` für die gesamte App bereit.
  - Umschlossen von `ApplicationServicesProvider` + `AuthProvider` in `app/_layout.tsx`
    
**Warum nicht vollständige DI?**
- `ApplicationServicesProvider` stellt alle Dienste einmalig über den React-Kontext an der Basis bereit.
- Controller rufen nur die Dienste ab, die sie benötigen, via `useApplicationServices`.
- Vermeidet Prop Drilling und hält gleichzeitig die Abhängigkeitsrichtung eindeutig.
- 
---

## Beispiel für Datenfluss: „Neue Gewohnheit speichern"

1. **Presentation** – Der Benutzer tippt auf die Schaltfläche „Gewohnheit hinzufügen” auf dem Startbildschirm.
2. **Controller** – `useHabitsController.saveHabit(name, description, frequency)` wird aufgerufen.
3. **Application** – `habitService.saveHabit(...)` steuert das Speichern.
4. **Infrastructure** – `apiHabitsRepository.saveHabit(...)` sendet eine HTTP-POST-Anfrage.
5. **Response** – Die neue Gewohnheit wird zurückgegeben und in den lokalen Status `habits` übernommen. 
6. **Re-render** – Die Komponente wird mit der aktualisierten Gewohnheitenliste neu gerendert.

---

## Wichtige Architekturprinzipien

### Dependency Injection (DI)
- Dienste werden in `ServiceContainer.ts` instanziiert
- `ApplicationServicesProvider` (eingebunden in `app/_layout.tsx`) macht diese Dienste über `useApplicationServices` verfügbar
- Controllers rufen `useApplicationServices()` auf, anstatt Infrastrukturmodule direkt zu importieren
- Hält Testschnittstellen klar und die Präsentationsschicht unabhängig von der Infrastruktur

### Trennung der Anliegen
- **Domäne -- Domain** = Was (Geschäftsregeln)
- **Anwendung -- Application** = Wie (Koordination)
- **Infrastruktur -- Infrastructure** = Wo (HTTP, Persistenz)
- **Präsentation -- Presentation** = Anzeige (React Native-Komponenten)

### Einseitige Abhängigkeiten
- Höhere Schichten (Präsentation) sind von niedrigeren Schichten (Domäne) abhängig.
- Niedrigere Schichten importieren niemals aus höheren Schichten.
- Ermöglicht das isolierte Testen der Domänenlogik.

### Einzelne Verantwortung
- Jeder Dienst verarbeitet eine logische Domäne (Authentifizierung, Gewohnheiten, Zitate, Profil).
- Jede Komponente rendert einen Teil der Benutzeroberfläche.
- Jeder Adapter verarbeitet ein externes System.

---

## Hinzufügen neuer Funktionen

### Schritt 1: Domäne definieren (falls erforderlich)
```typescript
// domain/entities/NewEntity.ts
export interface NewEntity {
  id: number;
  name: string;
}
```

### Schritt 2: Repository-Schnittstelle definieren
```typescript
// domain/repositories/INewRepository.ts
export interface INewRepository {
  getAll(): Promise<NewEntity[]>;
  save(entity: NewEntity): Promise<NewEntity>;
}
```

### Schritt 3: HTTP-Adapter implementieren
```typescript
// infrastructure/adapters/ApiNewRepository.ts
export class ApiNewRepository implements INewRepository {
  async getAll() {
    return axios.get('/new-endpoint').then(r => r.data);
  }
}
```

### Schritt 4: Application Service erstellen
```typescript
// application/services/NewService.ts
export class NewService {
  constructor(private repo: INewRepository) {}
  async getAll() {
    return this.repo.getAll();
  }
}
```

### Schritt 5: In DI-Container einbinden
```typescript
// infrastructure/di/ServiceContainer.ts
export const newService = new NewService(apiNewRepo);
```

### Schritt 6: Controller-Hook erstellen
```typescript
// presentation/controllers/useNewController.tsx
export function useNewController() {
  const [items, setItems] = useState<NewEntity[]>([]);
  const fetchItems = async () => {
    const data = await newService.getAll();
    setItems(data);
  };
  return { items, fetchItems };
}
```

### Schritt 7: Präsentationskomponente erstellen und im Bildschirm verwenden
```tsx
// presentation/ui/NewList.tsx
export const NewList: React.FC<Props> = ({ items, onSelect }) => {
  return items.map(item => <Pressable onPress={() => onSelect(item.id)} />);
};

// app/screens/new-screen.tsx
export default function NewScreen() {
  const { items, fetchItems } = useNewController();
  return <NewList items={items} onSelect={handleSelect} />;
}
```

---

## Teststrategie

### Unit-Tests (Domäne und Anwendung)
- Dienste isoliert mit Mock-Repositorys testen
- Beispiel: `AuthService.login()` ist mit gültigen Anmeldedaten erfolgreich, mit ungültigen Anmeldedaten fehlgeschlagen
- Speicherort: `*.test.ts`  neben den Dienstdateien oder in einem speziellen Ordner `__tests__/` 

### Integrationstests (Infrastruktur)
- Testen Sie HTTP-Adapter mit Mock-Servern oder echten Endpunkten (in der Testumgebung).
- Beispiel: Überprüfen Sie, ob `ApiHabitsRepository` die Antwort korrekt verarbeitet.

### Komponententests (Präsentation)
- Testen Sie Präsentationskomponenten mit Mock-Props.
- Verwenden Sie die React Native Testing Library.

### E2E-Tests
- Testen Sie vollständige Benutzerabläufe auf dem Gerät/Emulator mit Expo.
- Beispiel: Anmelden → Gewohnheit hinzufügen → Im Kalender überprüfen

---

## Regeln für die Benennung von Dateien

| Layer | Muster  | Beispiel |
|-------|---------|----------|
| Domain Entities | Groß- und Kleinschreibung | `User.ts`, `Habit.ts` |
| Repository Interfaces | `I` + Groß- und Kleinschreibung | `IHabitsRepository.ts` |
| Services | Groß- und Kleinschreibung + `Service` | `AuthService.ts` |
| Adapters | Groß- und Kleinschreibung + `Repository` | `ApiHabitsRepository.ts` |
| Controllers | `use` + Groß- und Kleinschreibung + `Controller` | `useHabitsController.tsx` |
| UI Components | Groß- und Kleinschreibung | `HabitList.tsx` |
| Screens | Kleinbuchstaben  | `index.tsx`, `login.tsx` |

---

## Häufige Muster

### Fehlerbehandlung
- Dienste werfen typisierte Fehler; Controller fangen diese ab und zeigen sie dem Benutzer an.
- HTTP-Adapter enthalten Try-Catch und werfen Fehler als Domänenfehler erneut.


### Ladezustände
- Controller verwalten die Flags „isLoading” und „isUpdating”.
- UI-Komponenten nutzen diese und zeigen Ladesymbole an.

### Caching
- Dienste speichern Daten im Komponentenstatus oder in einem einfachen In-Memory-Cache zwischen.
- Später kann Redux/Zustand für komplexe globale Zustände hinzugefügt werden.

### Authentifizierungsablauf
- `AuthContext` ist die Quelle für den Anmeldestatus.
- Bildschirme werden basierend auf `isLoggedIn` in bedingte Renderings eingebunden.

---

## Fehlerbehebung

### Fehler „Modul nicht gefunden“
- Überprüfen Sie, ob Importe relative Pfade verwenden: `../../domain/entities/User`
- Überprüfen Sie die Dateierweiterungen (`.ts`, `.tsx`)

### Dienst nicht initialisiert
- Stellen Sie sicher, dass der Dienst aus `ServiceContainer.ts` exportiert wird
- Überprüfen Sie, ob alle Abhängigkeiten (Repositorys) für den Dienstkonstruktor bereitgestellt werden


### Komponente wird nicht neu gerendert
- Überprüfen Sie, ob der Controller-Hook mit `useMemo` gespeicherte Werte zurückgibt.
- Überprüfen Sie, ob die Abhängigkeiten in den `useEffect`-Arrays korrekt sind.

### HTTP-Aufrufe scheitern ohne Fehlermeldung
- Fügen Sie Konsolenprotokolle im HTTP-Adapter hinzu.
- Überprüfen Sie, ob API_BASE_URL korrekt ist.
- Überprüfen Sie, ob das Auth-Token in den Anfrage-Headern gesendet wird.

---

## Vollständige DDD-Implementierung

### Domain Layer – All 7 Entities as ES6 Classes
- `User.ts` – Methods: `isValidEmail()`, `hasValidUsername()`, `getDisplayName()`
- `Habit.ts` – Methods: `getStreak()`, `isCompletedToday()`, `getCompletionRate()`, `hasMilestone(days)`
- `Quote.ts` – Methods: `getFormattedQuote()`, `getLength()`, `isValid()`, `getPreview(maxLength)`
- `TreeGrowth.ts` – Methods: `getGrowthStage()`, `getGrowthText()`, `isFullyGrown()`
- `Achievement.ts` – Methods: `getDaysSinceUnlock()`, `isRecent()`, `getFormattedUnlockDate()`
- `Streak.ts` – Methods: `isActive()`, `getMilestoneMessage()`, `getDisplayText()`
- `Entry.ts` –  Datensatz zur Erfassung der Gewohnheitserfüllung

**Alle 8 Repository-Schnittstellen:**

### Application Layer – 8 Services (alle abhängig von Schnittstellen)
- `AuthService` – Autorenkoordination + Persistenz
- `AuthenticationService` – Anmelde-/Registrierungsablauf
- `HabitService` – Gewohnheits-CRUD + Filterung
- `QuoteService` – Abrufen + Zwischenspeichern von Zitaten
- `ProfileService` – Aktualisierungen des Benutzerprofils
- `TreeGrowthService` – Logik für den Fortschritt des Baums
- `AchievementService` – Leistungssystem
- `StreakService` – Streak-Verfolgung + Meilensteine

### Infrastructure Layer – Alle Adapter erstellen Entitäten
**WICHTIG – Alle verwenden `new Entity()`, KEINE Typumwandlung:**- `ApiAuthRepository` – `new User(userData)` 
- `ApiHabitsRepository` – `.map(data => new Habit(data))` 
- `ApiQuotesRepository` – `.map(data => new Quote(data))` 
- `ApiProfileRepository` – `new User(userData)` 
- `SecureStoreAuthRepository` – `new User(userData)`  
- `ApiTreeGrowthRepository` – `new TreeGrowth(dummyData)` 
- `ApiAchievementRepository` – Achievement[] instantiation 
- `ApiStreakRepository` – `new Streak(dummyData)` 

### Presentation Layer – Reine Komponenten + Smart Controller
**Komponenten (100 % nur Präsentation):**
- `TreeView` – **REFACTORED:** Props-basiert aus tree.tsx-Bildschirm
- `CalendarView` – **REFACTORED:** Props-basiert aus dem Bildschirm calendar.tsx
- `InventoryView` – **REFACTORED:** Props-basiert aus dem Bildschirm inventory.tsx
- `QuoteBanner`, `HabitList`, `AuthForm`, `ProfileSettings`, `HabitModal` 

**Controllers (8 total):** Alle verwalten Serviceaufrufe + Status
- `useAuthController`, `useHabitsController`, `useQuoteController`, `useProfileController`
- `useTreeGrowthController`, `useAchievementController`, `useStreakController`, `useCalendarStatsController`

### App Layer – 9 Thin Screen Wrappers
Alle Bildschirme steuern Controller und übergeben Props:
- Root: `_layout.tsx`, `(auth)/_layout.tsx`, `(auth)/login.tsx`, `(tabs)/_layout.tsx`
- Feature Screens:
  - `(tabs)/index.tsx` – HomeScreen (habits + quotes + streak)
  - `(tabs)/calendar.tsx` – **FIXED:** Ruft useCalendarStatsController auf, übergibt Props an CalendarView
  - `(tabs)/tree.tsx` – **FIXED:** Ruft useTreeGrowthController auf, übergibt Props an TreeView
  - `(tabs)/inventory.tsx` – **FIXED:** Ruft useAchievementController auf, übergibt Props an InventoryView
  - `(tabs)/profile.tsx` – Ruft useProfileController auf

### Alle Dummy-Daten markiert
- Alle Dummy-Implementierungen verwenden Kommentare `//Dummy Hardcoded:`
- Bereit für die echte API-Integration

### Beispiel für Datenfluss: „Gewohnheit umschalten“
1. **Screen** (index.tsx) – Benutzer tippt auf Kontrollkästchen
2. **Controller** (useHabitsController) – Calls `handleToggleHabit(id, date)`
3. **Service** (HabitService) – Calls `habitRepo.toggleHabit(authToken, id, dateIso)`
4. **Adapter** (ApiHabitsRepository) – Führt HTTP PUT request durch
5. **Result** – Status aktualisiert, Komponente wird neu gerendert

### HTTP-Aufrufe schlagen stillschweigend fehl
- Konsolenprotokolle im HTTP-Adapter hinzufügen
- Überprüfen, ob API_BASE_URL korrekt ist
- Überprüfen, ob Auth-Token in den Anfrage-Headern gesendet wird

---

## References

- [Domain-Driven Design – Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture – Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [Expo Router Documentation](https://docs.expo.dev/routing/introduction/)
