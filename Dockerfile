FROM node:16
WORKDIR /usr/src/clea-code-api
COPY ./package.json .
RUN npm install --only=prod
