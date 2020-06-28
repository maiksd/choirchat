FROM node:14.4
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8081
CMD [ "node", "server.js" ]