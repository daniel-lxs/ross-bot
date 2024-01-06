FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .
COPY RSS.yml .

RUN bun install --production

COPY src src
COPY drizzle drizzle

RUN bun run run-migrations

ENV NODE_ENV production
CMD ["bun", "start"]

EXPOSE 3000