```mermaid
sequenceDiagram
    autonumber

    actor User as Nutzer (Tom)
    participant Mobile as Mobile App (React Native)
    participant API as Backend Service (REST API)
    participant Repo as HabitRepository (Prisma)
    participant DB as PostgreSQL

    User->>Mobile: App öffnen
    Mobile->>API: GET /dayplan

    API->>Repo: fetchHabitsForDate(currentLocalDate)
    Repo->>DB: SELECT * FROM habits WHERE date = today
    DB-->>Repo: rows
    Repo-->>API: List<Habit>

    API->>API: filter(startTime != null)
    API->>API: sortBy(startTime)

    API-->>Mobile: DayPlanResponse (gefilterte & sortierte Habits)

    alt Habits vorhanden
        Mobile-->>User: Tagesplan-UI mit allen heutigen Habits
    else Keine Habits vorhanden
        Mobile-->>User: Dashboard ohne Tagesplan-Bereich
    end
