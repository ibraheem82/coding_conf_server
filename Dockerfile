# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies including devDependencies (needed for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma/Drizzle client code if needed (ensure drizzle files are present)
# Build the TypeScript application
RUN npm run build

# ==========================================
# Stage 2: Production
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Copy Drizzle migration files (SQL)
COPY --from=builder /app/drizzle ./drizzle

# Copy static assets if any (not needed for API usually, but safe to verify)
# COPY --from=builder /app/public ./public

# Use non-root user for security
USER node

# Expose the port (must match PORT env var)
EXPOSE 9392

# Entrypoint script or command
# We chain the migration script and the app start
CMD ["sh", "-c", "node dist/migrate.js && node dist/app.js"]
