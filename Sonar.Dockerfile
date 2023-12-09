FROM sonarsource/sonar-scanner-cli

RUN apk add --update nodejs npm

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN sonar-scanner