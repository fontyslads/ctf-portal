FROM node:12
WORKDIR /ctf-portal/api/src/app
COPY package.json .
RUN npm install
ADD . /ctf-portal/api/src/app
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000