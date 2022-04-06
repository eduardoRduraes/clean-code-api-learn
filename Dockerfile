FROM node:16.14.2
WORKDIR /usr/src/clea-code-api
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start
