FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3010

CMD ["bun", "src/index.ts"]
