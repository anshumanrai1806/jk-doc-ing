FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["node", "dist/main.js"]
