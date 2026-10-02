# ---------- Production Dockerfile ----------
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source code
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
