FROM node:14-alpine

RUN npm install

WORKDIR /app

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "serve:prod"]