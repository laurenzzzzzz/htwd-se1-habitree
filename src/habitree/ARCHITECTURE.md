# Habitree Architecture – Domain-Driven Design (DDD)

## Overview

The Habitree project follows **Domain-Driven Design (DDD)** principles with a clear separation of concerns across four architectural layers:

- **Domain** – Core business logic, entities, and repository interfaces
- **Application** – Use-case services orchestrating domain logic
- **Infrastructure** – Adapters for external systems (HTTP, persistence, DI)
- **Presentation** – React Native UI components, screens, and controllers

This document describes the folder structure, responsibilities of each layer, and guidelines for contributors.

---

## Folder Structure

```
src/habitree/
├── domain/                           # Domain Layer
│   ├── entities/                     # Core domain entities
│   │   ├── User.ts
│   │   ├── Habit.ts
│   │   ├── Quote.ts
│   │   └── Entry.ts
│   └── repositories/                 # Repository interfaces (contracts)
│       ├── IAuthRepository.ts
│       ├── IHabitsRepository.ts
│       ├── IQuotesRepository.ts
│       ├── IProfileRepository.ts
│       └── IAuthApiRepository.ts
│
├── application/                      # Application Layer
│   └── services/                     # Use-case orchestration
│       ├── AuthService.ts            # Auth domain logic
│       ├── AuthenticationService.ts  # Login/register flow
│       ├── HabitService.ts           # Habit CRUD
│       ├── QuoteService.ts           # Quote fetching
│       └── ProfileService.ts         # User profile updates
│
├── infrastructure/                   # Infrastructure Layer
│   ├── adapters/                     # External system adapters
│   │   ├── ApiHabitsRepository.ts    # HTTP: habits endpoint
│   │   ├── ApiAuthRepository.ts      # HTTP: auth endpoint
│   │   ├── ApiQuotesRepository.ts    # HTTP: quotes endpoint
│   │   ├── ApiProfileRepository.ts   # HTTP: profile endpoint
│   │   └── SecureStoreAuthRepository.ts  # Local secure persistence
│   └── di/                           # Dependency Injection
│       └── ServiceContainer.ts       # Composition root (singleton exports)
│
├── presentation/                     # Presentation Layer
│   ├── controllers/                  # Smart hooks connecting UI to services
│   │   ├── useAuthController.tsx
│   │   ├── useHabitsController.tsx
│   │   ├── useQuoteController.tsx
│   │   └── useProfileController.tsx
│   └── ui/                           # Dumb presentational components
│       ├── QuoteBanner.tsx
│       ├── HabitList.tsx
│       ├── AuthForm.tsx
│       ├── ProfileSettings.tsx
│       ├── CalendarView.tsx
│       ├── TreeView.tsx
│       ├── InventoryView.tsx
│       └── HabitModal.tsx
│
├── app/                              # Expo Router screens
│   ├── _layout.tsx                   # Root layout & tab navigator
│   ├── (auth)/
│   │   └── login.tsx                 # Auth screen (uses LoginController)
│   └── (tabs)/
│       ├── index.tsx                 # Home screen (habits, quotes)
│       ├── calendar.tsx              # Calendar screen
│       ├── tree.tsx                  # Tree screen (rewards)
│       ├── inventory.tsx             # Inventory screen (items)
│       └── profile.tsx               # Profile screen (settings, user info)
│
├── context/                          # Global state & auth context
│   └── AuthContext.tsx               # Auth state, persistence adapter composition
│
├── styles/                           # StyleSheet definitions
├── constants/                        # Global constants
├── hooks/                            # Generic custom hooks
└── components/                       # Shared UI components (pre-DDD refactor)

```

---

## Layer Responsibilities

### 1. Domain Layer (`domain/`)

**Purpose:** Define core business concepts and rules independent of any framework or technology.

**Contents:**
- **Entities** (`domain/entities/`)
  - `User.ts` – User profile data (id, username, email)
  - `Habit.ts` – Habit definition and tracking data
  - `Quote.ts` – Daily motivational quote
  - `Entry.ts` – Habit completion entry for a specific date

- **Repository Interfaces** (`domain/repositories/`)
  - Define contracts that lower layers must implement
  - Example: `IHabitsRepository` declares `getHabits()`, `saveHabit()`, `toggleHabit()`
  - No implementation details; pure TypeScript interfaces

**Key Rules:**
- No imports from `application/`, `infrastructure/`, or `presentation/`
- Focus on data structures and business logic contracts
- Immutable by preference; use readonly fields where appropriate

---

### 2. Application Layer (`application/services/`)

**Purpose:** Orchestrate domain logic and coordinate use-cases; acts as a bridge between presentation and domain.

**Contents:**
- **Service Classes** – Implement use-cases by calling repositories and domain logic
  - `AuthService` – Manages auth state and local persistence (SecureStore)
  - `AuthenticationService` – Handles login/register flow
  - `HabitService` – CRUD operations for habits
  - `QuoteService` – Fetch and cache daily quotes
  - `ProfileService` – Update user profile and password

**Example Flow:**
```typescript
// ProfileService.updateUsername(authToken, newUsername)
// 1. Receives user request via controller hook
// 2. Calls profileRepository.updateUsername() (HTTP adapter)
// 3. Returns updated user entity
// 4. Controller updates state and re-renders
```

**Key Rules:**
- Depend on domain entities and repository interfaces (not implementations)
- No direct HTTP calls; use injected repository adapters
- Services are stateless; state managed by controllers or context

---

### 3. Infrastructure Layer (`infrastructure/`)

**Purpose:** Implement external system adapters and provide dependency injection.

**Contents:**

- **HTTP Adapters** (`infrastructure/adapters/`)
  - `ApiHabitsRepository.ts` – axios calls to `/habits` endpoint
  - `ApiAuthRepository.ts` – axios calls to `/auth` endpoint
  - `ApiQuotesRepository.ts` – axios calls to `/quotes` endpoint
  - `ApiProfileRepository.ts` – axios calls to `/user` endpoint
  - All adapters implement domain repository interfaces

- **Persistence Adapter**
  - `SecureStoreAuthRepository.ts` – Uses `expo-secure-store` to persist auth token and user data locally

- **DI Composition Root** (`infrastructure/di/ServiceContainer.ts`)
  - Exports singleton instances of all services
  - Wires repositories to services
  - Example:
    ```typescript
    export const authService = new AuthService(secureStoreAuthRepo);
    export const habitService = new HabitService(apiHabitsRepo);
    ```

**Key Rules:**
- Only place where direct axios/SecureStore calls occur
- All HTTP headers, error handling, and auth token injection happen here
- New external library usage should be wrapped in an adapter

---

### 4. Presentation Layer (`presentation/`)

**Purpose:** Render UI and manage local component state via controllers.

**Contents:**

- **Controller Hooks** (`presentation/controllers/`)
  - Smart hooks that bridge services and UI components
  - Manage loading states, errors, and local UI state
  - Example: `useHabitsController()` returns `{ habits, isLoading, fetchHabits, saveHabit, toggleHabit }`

- **Presentational Components** (`presentation/ui/`)
  - Dumb, reusable UI components
  - Receive props and emit callbacks; no business logic
  - Example: `HabitList` receives `habits` array and `onToggle` callback, renders items

**Example Pattern:**
```tsx
// Screen (e.g., index.tsx)
export default function HomeScreen() {
  const { habits, isLoading, fetchHabits } = useHabitsController();
  
  return (
    <HabitList habits={habits} onToggle={(id) => toggleHabitHandler(id)} />
  );
}
```

**Key Rules:**
- Controllers orchestrate services; components are presentation-only
- Components accept props and callbacks; no direct service calls
- Minimize component re-renders with `useMemo` and `useCallback`

---

### 5. Global State & Context (`context/`)

**Purpose:** Manage auth state and provide app-wide identity context.

**Contents:**
- `AuthContext.tsx`
  - Uses `AuthService` from DI container
  - Persists auth token via `SecureStoreAuthRepository`
  - Provides `isLoggedIn`, `currentUser`, `authToken`, `signOut()` to entire app
  - Wrapped around `RootLayout`

**Why Not Full DI?**
- Minimizes invasive DI throughout the component tree
- Auth context is a natural boundary for composition
- Other services are injected per-controller hook as needed

---

## Data Flow Example: "Save a New Habit"

1. **Presentation** – User taps "Add Habit" button in Home screen
2. **Controller** – `useHabitsController.saveHabit(name, description, frequency)` is called
3. **Application** – `habitService.saveHabit(...)` orchestrates the save
4. **Infrastructure** – `apiHabitsRepository.saveHabit(...)` makes HTTP POST request
5. **Response** – New habit returned and merged into local `habits` state
6. **Re-render** – Component re-renders with updated habit list

---

## Key Architectural Principles

### Dependency Injection (DI)
- Services are created once in `ServiceContainer.ts` and exported as singletons
- Controllers receive services via imports (not constructor injection)
- Reduces boilerplate while maintaining testability

### Separation of Concerns
- **Domain** = what (business rules)
- **Application** = how (orchestration)
- **Infrastructure** = where (HTTP, persistence)
- **Presentation** = display (React Native components)

### Unidirectional Dependencies
- Higher layers (Presentation) depend on lower layers (Domain)
- Lower layers never import from higher layers
- Enables testing domain logic in isolation

### Single Responsibility
- Each service handles one logical domain (Auth, Habits, Quotes, Profile)
- Each component renders one piece of UI
- Each adapter handles one external system

---

## Adding New Features

### Step 1: Define Domain (if needed)
```typescript
// domain/entities/NewEntity.ts
export interface NewEntity {
  id: number;
  name: string;
}
```

### Step 2: Define Repository Interface
```typescript
// domain/repositories/INewRepository.ts
export interface INewRepository {
  getAll(): Promise<NewEntity[]>;
  save(entity: NewEntity): Promise<NewEntity>;
}
```

### Step 3: Implement HTTP Adapter
```typescript
// infrastructure/adapters/ApiNewRepository.ts
export class ApiNewRepository implements INewRepository {
  async getAll() {
    return axios.get('/new-endpoint').then(r => r.data);
  }
}
```

### Step 4: Create Application Service
```typescript
// application/services/NewService.ts
export class NewService {
  constructor(private repo: INewRepository) {}
  async getAll() {
    return this.repo.getAll();
  }
}
```

### Step 5: Wire into DI Container
```typescript
// infrastructure/di/ServiceContainer.ts
export const newService = new NewService(apiNewRepo);
```

### Step 6: Create Controller Hook
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

### Step 7: Create Presentational Component & Use in Screen
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

## Testing Strategy

### Unit Tests (Domain & Application)
- Test services in isolation with mock repositories
- Example: `AuthService.login()` succeeds with valid credentials, fails with invalid
- Location: `*.test.ts` alongside service files or in a dedicated `__tests__/` folder

### Integration Tests (Infrastructure)
- Test HTTP adapters with mock server or real endpoints (in test environment)
- Example: Verify `ApiHabitsRepository` correctly parses response

### Component Tests (Presentation)
- Test presentational components with mock props
- Use React Native Testing Library

### E2E Tests
- Test full user flows on device/emulator with Expo
- Example: Login → Add Habit → Verify in calendar

---

## File Naming Conventions

| Layer | Pattern | Example |
|-------|---------|---------|
| Domain Entities | PascalCase | `User.ts`, `Habit.ts` |
| Repository Interfaces | `I` + PascalCase | `IHabitsRepository.ts` |
| Services | PascalCase + `Service` | `AuthService.ts` |
| Adapters | PascalCase + `Repository` | `ApiHabitsRepository.ts` |
| Controllers | `use` + PascalCase + `Controller` | `useHabitsController.tsx` |
| UI Components | PascalCase | `HabitList.tsx` |
| Screens | lowercase | `index.tsx`, `login.tsx` |

---

## Common Patterns

### Error Handling
- Services throw typed errors; controllers catch and display to user
- HTTP adapters include try-catch and re-throw as domain errors

### Loading States
- Controllers manage `isLoading`, `isUpdating` flags
- UI components consume these and show spinners

### Caching
- Services cache data in component state or a simple in-memory cache
- Consider adding Redux/Zustand for complex global state later

### Authentication Flow
- `AuthContext` is the source of truth for logged-in state
- Screens wrapped in conditional renders based on `isLoggedIn`

---

## Troubleshooting

### "Module not found" errors
- Verify imports use relative paths: `../../domain/entities/User`
- Check file extensions (`.ts`, `.tsx`)

### Service not initialized
- Ensure service is exported from `ServiceContainer.ts`
- Check that all dependencies (repositories) are provided to the service constructor

### Component not re-rendering
- Verify controller hook returns memoized values with `useMemo`
- Check that dependencies in `useEffect` arrays are correct

### HTTP calls failing silently
- Add console logs in the HTTP adapter
- Verify API_BASE_URL is correct
- Check Auth token is being sent in request headers

---

## Next Steps

1. **Add Unit Tests** – Create Jest config and write tests for core services
2. **Implement E2E Tests** – Use Expo testing tools or Detox
3. **Add State Management** – Consider Redux/Zustand if global state grows
4. **Documentation** – Keep this file updated as new features are added
5. **Code Review Checklist** – Use this architecture as basis for PR review standards

---

## References

- [Domain-Driven Design – Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture – Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [Expo Router Documentation](https://docs.expo.dev/routing/introduction/)
