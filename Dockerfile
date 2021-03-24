FROM node:12.16.1
RUN mkdir -p /mnt/ctf-bot
ADD . /mnt/ctf-bot
WORKDIR /mnt/ctf-bot
COPY package.json ./
RUN yarn install
EXPOSE 8081
RUN npm install -g pm2
RUN yarn schema:sync
CMD pm2-runtime start npm -- start 