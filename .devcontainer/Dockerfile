FROM node:20-slim

ENV EXPO_DEV_SERVER_LISTEN_HOST=0.0.0.0 \
    EXPO_USE_DEV_SERVER=1 \
    EXPO_NO_TELEMETRY=1 \
    NODE_ENV=development


RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    g++ \
    git \
    make \
    python3 \
  && rm -rf /var/lib/apt/lists/*

# Immer die neueste npm-Version installieren
RUN npm install -g npm@latest

COPY . .

EXPOSE 8081 19000 19001 19002 19006

