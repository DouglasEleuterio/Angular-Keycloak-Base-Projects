FROM node:18.17.0-alpine AS build

ARG VERSION

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

RUN npm run replace-version --build_version=${VERSION} --env_file="/usr/src/app/src/environments/environment.*"
RUN npm run build:docker

# RUN echo 'Instalação do certbot'
# Instale o Certbot manualmente aqui
# RUN apk add --no-cache certbot

FROM nginx:1.17.1-alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/app /usr/share/nginx/html

#RUN apt-get update && apt-get install -y certbot python3-certbot-nginx
