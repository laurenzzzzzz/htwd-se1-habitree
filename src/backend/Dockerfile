# Multi-stage build für optimierte Imagegröße
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm install

# Prisma CLI für Schema-Generierung
COPY prisma ./prisma
RUN npm install -g prisma

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Environment variable
ENV NODE_ENV=production

# User erstellen für Security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Dependencies aus Builder kopieren
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Prisma client generieren
COPY --chown=nodejs:nodejs prisma ./prisma
RUN npx prisma generate

# App-Code kopieren
COPY --chown=nodejs:nodejs src ./src

# Port exponieren
EXPOSE 8000

# Zu nodejs User wechseln
USER nodejs

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# App starten
CMD ["node", "src/index.js"]
