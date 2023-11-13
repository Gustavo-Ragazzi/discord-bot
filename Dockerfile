FROM node:18-bullseye-slim 

WORKDIR /app

RUN apt-get update && apt-get install -y wget gnupg
RUN sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt bullseye-pgdg main" > /etc/apt/sources.list.d/pgdg.list' \
     && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - 

RUN apt-get update \
    && apt-get install --no-install-recommends -y postgresql-client-16 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev

USER node

COPY --chown=node:node . .

# Allow node user to write to the backups directory
RUN chmod 700 /app/kelbi-backups

CMD ["node", "src/index.js"]
