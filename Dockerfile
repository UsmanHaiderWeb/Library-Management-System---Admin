# Builds the librarian portal and ships the result as a tiny image holding
# nothing but /dist.
#
# It runs no server of its own: on the deployment host a one-shot container
# copies /dist into a volume that the single front Caddy serves. That keeps
# one Caddy and one Caddyfile owning all routing and TLS, instead of a web
# server per portal.

FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Empty by default: the portal calls /api relatively and Caddy proxies it, so
# it is same-origin with the API. Set only if the API is on another origin.
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Required, and not optional in practice: without it the login page falls back
# to reading the college code from the first hostname label, which on
# admin.library.<college>.edu.pk is the literal string "admin".
ARG VITE_COLLEGE_CODE
ENV VITE_COLLEGE_CODE=$VITE_COLLEGE_CODE
RUN test -n "$VITE_COLLEGE_CODE" \
    || (echo "VITE_COLLEGE_CODE build arg is required — otherwise login sends the wrong college code" && exit 1)

RUN npm run build

FROM alpine:3
COPY --from=build /app/dist /dist
# Never actually run — the deploy compose overrides this with the copy command
CMD ["sh", "-c", "echo 'This image only carries /dist; see Backend/deploy.' && ls /dist"]
