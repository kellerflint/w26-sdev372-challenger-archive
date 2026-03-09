#!/bin/sh
set -e

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
WAIT_USER=${DB_ADMIN_USER:-$DB_USER}
WAIT_PASSWORD=${DB_ADMIN_PASSWORD:-$DB_PASSWORD}
AUTO_RELOAD=$(printf '%s' "${DB_AUTO_RELOAD:-false}" | tr '[:upper:]' '[:lower:]')

if [ -z "$WAIT_USER" ] || [ -z "$WAIT_PASSWORD" ]; then
  echo "Database user and password must be set before waiting for a connection."
  exit 1
fi

echo "Waiting for database at $DB_HOST:$DB_PORT..."
until mysqladmin ping -h "$DB_HOST" -P "$DB_PORT" -u "$WAIT_USER" -p"$WAIT_PASSWORD" --silent >/dev/null 2>&1; do
  printf '.'
  sleep 1
done

echo "\nDatabase is available."

if [ "$AUTO_RELOAD" = "true" ]; then
  echo "Running database reload script..."
  npm run db:reload
else
  echo "DB reload skipped (set DB_AUTO_RELOAD=true to enable)."
fi

exec "$@"
