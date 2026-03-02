# Base stage for both dev and prod
FROM node:20-bookworm-slim AS base
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
COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]