FROM node:12-alpine3.14
WORKDIR /app
COPY package.json /app
RUN npm init --yes; npm install express aws-sdk --save
COPY . /app
CMD node server.js
EXPOSE 80
