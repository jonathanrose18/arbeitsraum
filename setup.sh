#!/usr/bin/env bash
set -euo pipefail

# One-click setup: configure environment and start the app with Docker.

# ── Prerequisites ─────────────────────────────────────────────────────────────
check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    echo "Error: '$1' is required but not installed." >&2
    exit 1
  fi
}
check_cmd docker
check_cmd openssl

# ── Environment file ──────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

# Generate BETTER_AUTH_SECRET if missing or empty
if ! grep -qE '^BETTER_AUTH_SECRET=.+' .env; then
  SECRET=$(openssl rand -base64 32)
  if grep -q '^BETTER_AUTH_SECRET=' .env; then
    # Replace the existing empty line
    sed -i.bak "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=${SECRET}|" .env && rm -f .env.bak
  else
    echo "BETTER_AUTH_SECRET=${SECRET}" >> .env
  fi
  echo "Generated BETTER_AUTH_SECRET."
fi

# ── Start ─────────────────────────────────────────────────────────────────────
echo "Building and starting the app..."
docker compose up -d --build

echo ""
echo "App is starting at http://localhost:$(grep -E '^PORT=' .env | cut -d= -f2 || echo 3000)"
echo "Run 'docker compose logs -f web' to follow logs."
