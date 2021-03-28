FROM node:12.16.1
RUN mkdir -p /mnt/ctf-bot
ADD . /mnt/ctf-bot
WORKDIR /mnt/ctf-bot
COPY package.json ./
RUN yarn install
EXPOSE 8081
RUN apt-get update && \
    apt-get install curl -y
RUN curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o wait-for-it.sh
RUN chmod +x ./wait-for-it.sh
RUN npm install -g pm2
CMD ./wait-for-it.sh ctf-db:3306 -- ./run.sh
