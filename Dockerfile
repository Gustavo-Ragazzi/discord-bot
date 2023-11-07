FROM postgres:16

RUN apt-get update && apt-get install -y \
    nodejs \
    npm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "src/index.js"]
