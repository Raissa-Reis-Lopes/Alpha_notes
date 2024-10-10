FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001
CMD ["sh", "-c", "until nc -z db 5432; do echo waiting for db; sleep 2; done; node dist/index.js"]
