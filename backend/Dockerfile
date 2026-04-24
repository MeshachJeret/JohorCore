FROM node:20
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# 1. Copy everything inside the backend folder
COPY . .

# 2. Copy the 'public' folder from the parent directory 
# into a 'public' folder inside the container
COPY public ./public

EXPOSE 8080
CMD [ "node", "server.js" ]