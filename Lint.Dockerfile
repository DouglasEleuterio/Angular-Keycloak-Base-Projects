FROM node:14.21.3-alpine

WORKDIR /usr/app
COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run lint
