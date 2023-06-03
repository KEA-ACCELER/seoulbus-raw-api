FROM node:latest

WORKDIR /app

COPY . /app

WORKDIR /app/front

RUN npm install

RUN npm run build

WORKDIR /app/server

# ENV NODE_OPTIONS=--max-old-space-size=3072
RUN npm install

CMD ["node", "server.js"]