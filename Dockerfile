FROM oven/bun:1
WORKDIR /app

COPY . .

RUN bun install && bun run build

EXPOSE 3000

CMD ["bun", "build/index.js"]