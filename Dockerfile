FROM node:24.3

WORKDIR /usr/src/app

COPY app . 

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
