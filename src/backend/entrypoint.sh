#!/bin/sh
set -e

# Wait for Postgres to be available, then run Prisma migrations, then start the app.

info() { echo "[entrypoint] $*"; }

get_host_port_from_database_url() {
  # Expect format postgresql://user:pass@host:port/dbname
  if [ -n "$DATABASE_URL" ]; then
    host=$(echo "$DATABASE_URL" | sed -n 's#.*@\([^:/]*\).*#\1#p')
    port=$(echo "$DATABASE_URL" | sed -n 's#.*@[^:]*:\([0-9]*\)/.*#\1#p')
    # If sed didn't match port, leave empty
    [ "$host" = "$DATABASE_URL" ] && host=""
    [ "$port" = "$DATABASE_URL" ] && port=""
  fi
  # Allow explicit DB_HOST/DB_PORT override
  host=${DB_HOST:-$host}
  port=${DB_PORT:-$port}
  echo "$host:$port"
}


# Use DB_HOST and DB_PORT for database connection, do not overwrite PORT env var
DB_HOSTPORT=$(get_host_port_from_database_url)
DB_HOST=$(echo "$DB_HOSTPORT" | cut -d: -f1)
DB_PORT_VAL=$(echo "$DB_HOSTPORT" | cut -d: -f2)


if [ -z "$DB_HOST" ] || [ "$DB_HOST" = "" ]; then
  info "No DB host resolved from DATABASE_URL or DB_HOST; skipping wait/migrate. Starting app."
  exec node src/index.js
fi

info "Waiting for database at $DB_HOST:${DB_PORT_VAL:-5432}..."
retries=0
max_retries=30
while ! pg_isready -h "$DB_HOST" -p "${DB_PORT_VAL:-5432}" >/dev/null 2>&1; do
  retries=$((retries+1))
  if [ $retries -ge $max_retries ]; then
    echo "[entrypoint] timed out waiting for database at $DB_HOST:${DB_PORT_VAL:-5432}" >&2
    exit 1
  fi
  sleep 2
done

info "Database is available — running Prisma migrations"
if npx prisma migrate deploy; then
  info "Migrations applied"
else
  echo "[entrypoint] Prisma migrate deploy failed" >&2
  exit 1
fi

info "Starting application"
echo "[entrypoint] ENV PORT: $PORT"
exec node src/index.js
