FROM node:latest

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "SeoulAPI.js"]