FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY . .

RUN npm --workspace apps/api run prisma:generate \
  && npm --workspace apps/api run build

WORKDIR /app/apps/api

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "./docker-entrypoint.sh"]
