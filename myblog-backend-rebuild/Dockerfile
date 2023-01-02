FROM node:18

RUN npm install pm2 -g

WORKDIR /app

COPY . .

RUN yarn

RUN npm run build

EXPOSE 7777


# CMD ["npm","run","start"]
CMD ["npm","run","docker:start"]
