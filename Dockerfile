FROM node:16
WORKDIR /usr/src/clean-node-api
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install --only=prod
