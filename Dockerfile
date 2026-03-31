# Stage 1: Base
FROM node:24-alpine AS base

# Install dependencies needed for node-gyp and other native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Stage 3: Build
FROM deps AS build
COPY . .
RUN node ace build --ignore-ts-errors

# Stage 4: Production
FROM node:24-alpine AS production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
WORKDIR /app

# Copy compiled package.json from build folder
COPY --from=build /app/build/package*.json ./
RUN npm install --omit=dev

# Copy the rest of the build artifacts
COPY --from=build /app/build ./build
COPY --from=build /app/build/public ./public

EXPOSE 3333
# Use absolute path for the entrypoint
CMD ["node", "build/bin/server.js"]
