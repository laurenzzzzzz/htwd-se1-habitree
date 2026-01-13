# Systemtests Habitree

Vor Release durchklicken (~10-15 Min).

---

## ST-01: Login & Registrierung
- App öffnen → Login-Screen
- Credentials eingeben → Dashboard lädt
- Zurück zum Login → Registrierung testen
- Neuen Account anlegen → Automatisch eingeloggt

☐ OK

## ST-02: Habit CRUD
- Habit erstellen ("Joggen") → erscheint in Liste
- Abhaken → Checkmark
- App neu starten → Status persistiert
- Habit bearbeiten → Name ändert sich
- Habit löschen → verschwindet aus Liste

☐ OK

## ST-03: Streak-Logik
- Habit 2 Tage hintereinander abhaken
- Streak zeigt "2"
- Einen Tag auslassen → Streak zurück auf 0
- Wieder abhaken → Streak startet bei 1

☐ OK

## ST-04: Validierung & Fehlerfälle
- Habit ohne Namen anlegen → Fehlermeldung
- Habit mit leerem Namen → kein Speichern
- Login mit falschem Passwort → Error-Nachricht
- Registrierung mit existierender E-Mail → Fehler

☐ OK

## ST-05: Verschiedene Frequenzen
- Daily Habit erstellen → heute und morgen fällig
- Weekly Habit (Mo, Mi, Fr) → nur an diesen Tagen fällig
- Interval Habit (alle 3 Tage) → Logik korrekt
- Monthly Habit → jeden Monat am gleichen Tag

☐ OK

## ST-06: Tree Growth & Gamification
- Neuen Habit anlegen → Baum erscheint
- Habit mehrfach abhaken → Baum wächst
- Achievement erreichen → Benachrichtigung/Badge
- Baum ernten (wenn verfügbar) → in Inventar

☐ OK

## ST-07: Kalender-Ansicht
- Kalender-Tab öffnen → aktueller Monat sichtbar
- Vergangene Tage zeigen Completion-Status
- Auf vergangenen Tag tippen → Details anzeigen
- Zwischen Monaten wechseln → Daten laden korrekt

☐ OK

## ST-08: Profil & Settings
- Profil öffnen → Username angezeigt
- Username ändern → Update erfolgreich (oder Bug #326 reproduzieren)
- Passwort ändern → funktioniert
- Logout → zurück zum Login-Screen

☐ OK

## ST-09: Notifications (wenn aktiviert)
- Habit mit Reminder-Zeit erstellen
- App im Hintergrund lassen
- Zur Reminder-Zeit → Push-Notification erscheint
- Notification antippen → App öffnet

☐ OK

## ST-10: Offline-Verhalten & Sync
- Habit offline abhaken → lokal gespeichert
- Wieder online gehen → Sync mit Backend
- Daten bleiben konsistent
- Keine Duplikate oder Datenverlust

☐ OK

---

**Bei Bug gefunden:** GitHub Issue anlegen + Label `defect`

**Test-Status:**
- ☐ Alle Tests bestanden
- ☐ Bugs dokumentiert
- ☐ Release-Ready
