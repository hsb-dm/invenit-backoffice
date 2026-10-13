FROM node:22-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm build

FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1919

WORKDIR /app

RUN addgroup --system app && adduser --system --ingroup app app

COPY --from=build --chown=app:app /app/build ./build
COPY --chown=app:app package.json ./

USER app

EXPOSE 1919

CMD ["node", "build"]
