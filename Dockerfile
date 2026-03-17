# Base stage for both dev and prod
FROM --platform=$BUILDPLATFORM node:20-bookworm-slim AS base
WORKDIR /dashboard
COPY ./package.json ./package-lock.json ./

# Development stage
FROM base AS development
RUN npm install
CMD ["sh", "-c", "npm install && npm run dev"]

# Build stage
FROM base AS build
RUN npm ci
COPY . /dashboard
RUN npm run build

# Production stage
FROM nginx:alpine AS production
RUN apk add --no-cache nodejs supervisor docker-cli
COPY --from=build /dashboard/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./server/status.mjs /app/status.mjs
COPY ./supervisord.conf /etc/supervisord.conf
EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisord.conf"]