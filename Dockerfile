# Shared
FROM node:17.9.0-alpine AS base

WORKDIR /usr/src/app

# Build step
FROM base AS builder

# Copy files necessary for install
COPY package*.json ./

# Install
RUN npm ci

# Copy files necessary for build
COPY ./src ./src

RUN npm run build

# Release step
FROM base AS release

COPY --from=builder /usr/src/app/dist ./dist

ENTRYPOINT ["node", "/usr/src/app/dist/index.js"]
