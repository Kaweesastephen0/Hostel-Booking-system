FROM node:21-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 80
RUN npm run build
CMD [ "npm", "start" ]

# Use the official Microsoft base image for Node.js
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# [Optional] Uncomment if you want to install more global node packages
# RUN sudo -u node npm install -g <your-package-name-here>

# [Optional] Uncomment this section to install MongoDB. The base image uses Debian Linux.
# RUN sudo apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && sudo apt-get install -y wget \
#     && wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add - \
#     && echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
#     && sudo apt-get update \
#     && sudo apt-get install -y mongodb-mongosh