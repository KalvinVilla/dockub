# Base image
FROM node:lts-bookworm-slim AS base
WORKDIR /app
RUN apt update && \
    apt install -y curl wget fontconfig && \
    rm -rf /var/lib/apt/lists/*

# Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333
ENV LOG_LEVEL=info
ENV SESSION_DRIVER=cookie

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./
COPY --from=build /app/tmp ./tmp

EXPOSE 3333
CMD ["node", "bin/server.js"]
