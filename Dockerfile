FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

COPY client/ ./client/
RUN npm run install-client --only=production
RUN npm run build --prefix client

COPY server/ ./server/
RUN npm run install-server --only=production



USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8080
