# Docker Setup für HabitTree Backend

Dieses Setup ermöglicht es, das Backend mit PostgreSQL in Docker zu containerisieren.

## Voraussetzungen

- Docker installiert ([Download](https://www.docker.com/products/docker-desktop))

## Schnellstart

### 1. Environment-Variablen konfigurieren

```bash
# Kopiere die .env.example zu .env (nur beim ersten Mal nötig)
cp .env.example .env
```

Bearbeite `.env` und passe die Werte an:
```env
DB_USER=postgres
DB_PASSWORD=securepassword123
DB_NAME=habitree_db
JWT_SECRET=dein_jwt_secret_hier
```

### 2. Container starten

```bash
# Starte alle Services (Backend + PostgreSQL)
docker-compose up -d

# Oder mit automatischem Build
docker-compose up --build -d
```

### 3. Datenbank initialisieren

```bash
# Führe Prisma Migrations durch
docker-compose exec backend npx prisma migrate deploy

# Optional: Seeding (falls vorhanden)
docker-compose exec backend npx prisma db seed
```

### 4. Verfügbarkeit prüfen

Das Backend läuft jetzt unter: `http://localhost:8000`

```bash
# Logs anschauen
docker-compose logs -f backend

# Health Check
curl http://localhost:8000/health
```

## Wichtige Befehle

```bash
# Services neu starten
docker-compose restart

# Services stoppen (Daten bleiben erhalten)
docker-compose down

# Services und Volumes löschen (DATENBANK WIRD GELÖSCHT!)
docker-compose down -v

# Logs anschauen
docker-compose logs -f backend
docker-compose logs -f db

# In Backend-Container shell gehen
docker-compose exec backend sh

# Prisma Studio öffnen
docker-compose exec backend npx prisma studio

# Datenbank in PostgreSQL mit psql verbinden
docker-compose exec db psql -U postgres -d habitree_db
```

## Netzwerk

Die Services kommunizieren über `habitree-network`:
- **Backend Container** hat Host `backend`
- **Datenbank Container** hat Host `db`
- Externe Ports: Backend `8000`, PostgreSQL `5432`

## Datenbank-Persistierung

Die PostgreSQL-Daten werden in einem Docker Volume (`postgres_data`) gespeichert und bleiben auch nach `docker-compose down` erhalten.

Um die Datenbank komplett zurückzusetzen:
```bash
docker-compose down -v
```

## Troubleshooting

###  Backend kann sich nicht mit Datenbank verbinden

**Symptom:** Fehler in Logs: `Error: connect ECONNREFUSED` oder `FATAL: database does not exist`

**Lösungen:**
```bash
# 1. Logs der Datenbank prüfen
docker-compose logs db

# 2. Auf Health Check warten (dauert 2-3 Min beim ersten Start)
docker-compose logs -f db | grep "ready to accept"

# 3. Backend-Logs prüfen
docker-compose logs backend

# 4. Services neu starten
docker-compose down
docker-compose up -d --build

# 5. Volumes zurücksetzen (LÖSCHT DATENBANK!)
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

**Häufige Ursachen:**
- Datenbank braucht noch Zeit zum Starten (warten!)
- Falsche `DATABASE_URL` oder `DB_*` Variablen in `.env`
- Docker Daemon nicht gestartet
- Alte Container/Volumes nicht gelöscht

---

### Port 8000 oder 5432 bereits in Verwendung

**Symptom:** `Error: bind: address already in use` oder Port bereits belegt

**Lösungen (Windows PowerShell):**
```powershell
# Welcher Prozess nutzt Port 8000?
netstat -ano | findstr ":8000"

# Prozess beenden (mit PID aus obigem Output)
Stop-Process -Id PID -Force

# Oder andere Ports in .env nutzen:
# PORT=3000
# DB_PORT=5433
```

**Lösungen (Linux/Mac):**
```bash
# Prozess auf Port 8000 finden
lsof -i :8000

# Oder einfach andere Ports in .env verwenden
PORT=3000 DB_PORT=5433 docker-compose up -d
```

---

## Production Deployment

1. JWT_SECRET mit starkem Secret ersetzen
2. DB_PASSWORD mit sicherem Password ersetzen
3. Environment zu `production` setzen
4. Environment-Variablen via Secrets Manager verwenden (nicht im `.env`)
5. Docker Image bauen und zu Registry pushen (Docker Hub, ECR, etc.)

```bash
# Image bauen
docker build -t habitree-backend:latest .

# Zu Registry pushen
docker tag habitree-backend:latest username/habitree-backend:latest
docker push username/habitree-backend:latest
```

## Weitere Infos

- [Docker Dokumentation](https://docs.docker.com/)
- [Docker Compose Dokumentation](https://docs.docker.com/compose/)
- [Prisma Dokumentation](https://www.prisma.io/docs/)
