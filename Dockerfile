FROM node:latest

WORKDIR /app

COPY . /app

# ENV NODE_OPTIONS=--max-old-space-size=3072
RUN npm install

CMD ["node", "SeoulAPI.js", "--max-old-space-size=10000"]