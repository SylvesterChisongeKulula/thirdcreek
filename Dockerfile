# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV DATABASE_URL=file:.data/thirdcreek.db
# SESSION_PASSWORD (32+ chars) must be supplied at runtime (e.g. via docker-compose or `docker run -e`) — not baked in here.
COPY --from=build /app/.output ./.output
COPY --from=build /app/server/db/migrations ./server/db/migrations
VOLUME /app/.data
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
