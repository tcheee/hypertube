FROM node:14.17.1
WORKDIR '/usr/app'
COPY ./package.json .
RUN npm install
COPY . .
RUN npm install prisma
CMD ["npm", "run", "launch"]