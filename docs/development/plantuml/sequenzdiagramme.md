# Habitree – Sequenzdiagramme zu den wichtigsten User Stories

## Inhaltsverzeichnis
- [1. Login (US #250)](#1-login-us-250)
- [2. Registrierung (US #250)](#2-registrierung-us-250)
- [3. Logout (US #250)](#3-logout-us-250)
- [4. Habit erstellen (US #92/ US #279 / US #280)](#4-habit-erstellen-us-92-us-279--us-280)
- [5. Habit abhaken (US #93/ US #299)](#5-habit-abhaken-us-93-us-299)
- [6. Habit-Liste abrufen (US #93)](#6-habit-liste-abrufen-us-93)



## 1. Login (US #250)

**User Story**  
Als Nutzer möchte ich mich anmelden können, um Zugriff auf meine persönlichen Habits zu erhalten.

```mermaid
sequenceDiagram
    autonumber
    actor Nutzer as Nutzer
    participant Expo as Expo App (React Native)
    participant FEAuth as useAuthController
    participant ApiRepo as ApiAuthRepository
    participant Express as Express Router (/auth)
    participant Prisma as Prisma ORM
    participant PG as PostgreSQL (HabitTrackerDatabase)

    Nutzer->>Expo: E-Mail & Passwort eingeben
    Expo->>FEAuth: login(email, password)
    FEAuth->>ApiRepo: POST /auth/login

    ApiRepo->>Express: HTTP Request (email, password)
    Express->>Prisma: prisma.user.findUnique({ where: { email } })
    Prisma->>PG: SELECT * FROM "User" WHERE email = ...
    PG-->>Prisma: UserRecord
    Prisma-->>Express: UserRecord

    alt User nicht gefunden
        Express-->>ApiRepo: 401 Unauthorized
        ApiRepo-->>FEAuth: Fehler
        FEAuth-->>Expo: Fehlermeldung anzeigen
    else User gefunden
        Express->>Express: Passwortvergleich (bcrypt.compare)
        alt Passwort korrekt
            Express->>Express: JWT Token erzeugen
            Express-->>ApiRepo: 200 OK (token, user)
            ApiRepo-->>FEAuth: token + user
            FEAuth-->>Expo: Login erfolgreich
        else Passwort falsch
            Express-->>ApiRepo: 401 Unauthorized
            ApiRepo-->>FEAuth: Fehler
            FEAuth-->>Expo: Fehlermeldung anzeigen
        end
    end
```



## 2. Registrierung (US #250)

**User Story**  
Als neuer Nutzer möchte ich ein Konto erstellen können, um die App nutzen zu können.

```mermaid
sequenceDiagram
    autonumber
    actor Nutzer as Nutzer
    participant Expo as Expo App (React Native)
    participant FEAuth as useAuthController
    participant ApiRepo as ApiAuthRepository
    participant Express as Express Router (/auth)
    participant Prisma as Prisma ORM
    participant PG as PostgreSQL (HabitTrackerDatabase)

    Nutzer->>Expo: Registrierungsdaten eingeben
    Expo->>FEAuth: register(data)
    FEAuth->>ApiRepo: POST /auth/register

    ApiRepo->>Express: HTTP Request (email, password, name)

    Express->>Express: Validierung der Eingaben

    alt Ungültige Eingaben
        Express-->>ApiRepo: 400 Bad Request (Validation Error)
        ApiRepo-->>FEAuth: Fehler
        FEAuth-->>Expo: Fehlermeldung anzeigen
    else E-Mail bereits vergeben
        Express->>Prisma: prisma.user.findUnique({ where: { email } })
        Prisma->>PG: SELECT * FROM "User" WHERE email = ...
        PG-->>Prisma: UserRecord (exists)
        Prisma-->>Express: UserRecord
        Express-->>ApiRepo: 409 Conflict (Email exists)
        ApiRepo-->>FEAuth: Fehler
        FEAuth-->>Expo: Fehlermeldung anzeigen
    else Registrierung erfolgreich
        Express->>Prisma: prisma.user.create({ data })
        Prisma->>PG: INSERT INTO "User" (...)
        PG-->>Prisma: CreatedUser
        Prisma-->>Express: CreatedUser
        Express-->>ApiRepo: 201 Created (user)
        ApiRepo-->>FEAuth: user
        FEAuth-->>Expo: Registrierung erfolgreich
    end
```



## 3. Logout (US #250)

**User Story**  
Als Nutzer möchte ich mich ausloggen können, um mein Konto zu schützen.

```mermaid
sequenceDiagram
    autonumber
    participant Expo as Expo App
    participant FEAuth as useAuthController

    Expo->>FEAuth: logout()
    FEAuth->>FEAuth: Token löschen
    FEAuth-->>Expo: Navigation zum LoginScreen
```



## 4. Habit erstellen (US #92/ US #279 / US #280)

**User Story**  
Als Nutzer möchte ich ein neues Habit erstellen können, damit ich meine Ziele strukturiert planen kann.

```mermaid
sequenceDiagram
    autonumber
    actor Nutzer as Nutzer
    participant Expo as Expo App (React Native)
    participant FEHabit as useHabitsController
    participant ApiRepo as ApiHabitsRepository
    participant Express as Express Router (/habits)
    participant Prisma as Prisma ORM
    participant PG as PostgreSQL (HabitTrackerDatabase)

    Nutzer->>Expo: Habit-Daten eingeben
    Expo->>FEHabit: saveHabit(habitData)
    FEHabit->>ApiRepo: POST /habits (habitData)

    ApiRepo->>Express: HTTP Request (JSON HabitData)
    Express->>Express: Validierung (label vorhanden?)

    alt label fehlt
        Express-->>ApiRepo: 400 Bad Request
        ApiRepo-->>FEHabit: Fehler
        FEHabit-->>Expo: Fehlermeldung anzeigen
    else label ok
        Express->>Prisma: prisma.habit.create({ data: habitData })
        Prisma->>PG: INSERT INTO Habit (...)
        PG-->>Prisma: CreatedHabitRecord
        Prisma-->>Express: CreatedHabitRecord

        Express-->>ApiRepo: 201 Created (Habit)
        ApiRepo-->>FEHabit: Habit zurückgeben
        FEHabit-->>Expo: Habit erfolgreich erstellt
    end
```



## 5. Habit abhaken (US #93/ US #299)

**User Story**  
Als Nutzer möchte ich ein Habit abhaken können, um meinen täglichen Fortschritt zu dokumentieren.

```mermaid
sequenceDiagram
    autonumber
    participant Expo as Expo App (React Native)
    participant FEHabit as useHabitsController
    participant ApiRepo as ApiHabitsRepository
    participant Express as Express Router (/habits)
    participant Prisma as Prisma ORM
    participant PG as PostgreSQL (HabitTrackerDatabase)

    Expo ->> FEHabit: toggleHabit(id, dateIso?)
    FEHabit ->> ApiRepo: PUT /habits/:id/toggle { date }
    ApiRepo ->> Express: HTTP Request (date)
    Express ->> Prisma: prisma.habit.toggle(..., date)
    Prisma ->> PG: ...
    PG -->> Prisma: UpdatedHabit
    Prisma -->> Express: UpdatedHabit
    Express -->> ApiRepo: UpdatedHabit
    ApiRepo -->> FEHabit: UpdatedHabit
    FEHabit -->> Expo: UI aktualisieren
```



## 6. Habit-Liste abrufen (US #93)

**User Story**  
Als Nutzer möchte ich eine Übersicht meiner Habits sehen können, um meinen Fortschritt zu verfolgen.

```mermaid
sequenceDiagram
    autonumber
    participant Expo as Expo App (React Native)
    participant FEHabit as useHabitsController
    participant ApiRepo as ApiHabitsRepository
    participant Express as Express Router (/habits)
    participant Prisma as Prisma ORM
    participant PG as PostgreSQL (HabitTrackerDatabase)

    Expo->>FEHabit: fetchHabits()
    FEHabit->>ApiRepo: GET /habits
    ApiRepo->>Express: HTTP Request
    Express->>Prisma: prisma.habit.findMany()
    Prisma->>PG: SELECT * FROM "Habit"
    PG-->>Prisma: HabitList
    Prisma-->>Express: HabitList
    Express-->>ApiRepo: HabitList
    ApiRepo-->>FEHabit: HabitList
    FEHabit-->>Expo: HabitList anzeigen
