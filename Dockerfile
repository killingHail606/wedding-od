# --- Build & run the Nuxt node-server with SQLite ---
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm PATH="/pnpm:$PATH"
RUN corepack enable
# Toolchain for building native modules (better-sqlite3) if no prebuilt binary.
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install dependencies (cached layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app
COPY . .
RUN pnpm build

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
# SQLite + uploaded images live on a mounted volume in production (see README).
ENV NUXT_DATABASE_URL=/data/wedding.db
ENV NUXT_UPLOADS_DIR=/data/uploads

EXPOSE 3000

# Apply migrations + seed defaults (idempotent), then start the server.
CMD ["sh", "-c", "pnpm db:migrate && pnpm db:seed && node .output/server/index.mjs"]
