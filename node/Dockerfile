FROM node:20-slim

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3000

USER root

CMD [ "npm", "run", "dev" ]


