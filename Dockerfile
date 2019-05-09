FROM node:11
COPY . /flexibot
WORKDIR /flexibot
RUN npm install
CMD node index.js