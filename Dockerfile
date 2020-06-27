FROM node:14.4

# create app directory
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8081
CMD [ "node", "server.js" ]
