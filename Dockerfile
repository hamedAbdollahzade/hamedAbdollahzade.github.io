# syntax=docker/dockerfile:1

# ---- Build: Next.js static export -> /app/out ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Optional: your own form backend (see README). Leave empty to use WhatsApp only.
ARG NEXT_PUBLIC_FORM_ENDPOINT=""
ENV NEXT_PUBLIC_FORM_ENDPOINT=$NEXT_PUBLIC_FORM_ENDPOINT
RUN npm run build

# ---- Serve: nginx with the static files ----
FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
