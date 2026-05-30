FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./
RUN npm install
RUN npm run prisma:generate

COPY . .
RUN npm run build

EXPOSE 3333
CMD ["npm","run","start:prod"]
