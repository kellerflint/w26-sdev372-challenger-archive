FROM node:21

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update \
  && apt-get install -y default-mysql-client \
  && rm -rf /var/lib/apt/lists/*

RUN chmod +x ./scripts/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
CMD ["npm", "start"]
