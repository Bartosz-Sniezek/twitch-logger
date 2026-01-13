FROM node:24.12.0-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

FROM base AS build

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
COPY packages/tsconfig.base.json ./packages/tsconfig.base.json

WORKDIR /app/packages/shared

RUN pnpm build

WORKDIR /app/apps/frontend
RUN pnpm build

FROM base AS production

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/apps/frontend/.next/standalone ./

COPY --from=build /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=build /app/apps/frontend/public ./apps/frontend/public

WORKDIR /app

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "apps/frontend/server.js"]
