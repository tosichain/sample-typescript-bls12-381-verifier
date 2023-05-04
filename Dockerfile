FROM node:16-alpine

WORKDIR /index

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./tsconfig.json ./

RUN npm run build

RUN rm -rf node_modules

RUN npm install --omit=dev

COPY ./init /init

CMD ["npm", "run", "start"]
