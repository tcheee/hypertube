FROM node:alpine

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

RUN npx prisma migrate dev --name init

CMD ["npm", "run", "start"]