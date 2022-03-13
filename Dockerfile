FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install -g npm@latest 

RUN npm cache clear --force

RUN npm install

ENV PORT=7550

EXPOSE 7550

# Needs more ram to build on aws 

CMD ["npm", "run", "start"]