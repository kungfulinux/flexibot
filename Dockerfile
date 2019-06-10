FROM node:11
COPY . /flexibot
COPY buildspec.yml /
WORKDIR /flexibot
RUN npm install
CMD node index.js